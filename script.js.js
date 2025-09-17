// Questions data
const questions = {
    biological: {
        100: {
            question: "These biological and physiological characteristics define living things as male or female, including gonads, reproductive anatomy, chromosomes, and hormones.",
            answer: "What is sex?"
        },
        200: {
            question: "These sexual characteristics are present at birth and include external and internal genitalia necessary for sexual reproduction.",
            answer: "What are primary sexual characteristics?"
        },
        300: {
            question: "These physical features typically appear during puberty and allow differentiation between males and females, such as voice changes and breast development.",
            answer: "What are secondary sexual characteristics?"
        },
        400: {
            question: "These chemical substances released by glands are responsible for the development of secondary sexual characteristics during adolescence.",
            answer: "What are hormones?"
        },
        500: {
            question: "This term describes variations in sex characteristics that don't fit typical male or female classifications.",
            answer: "What are intersex conditions?"
        }
    },
    orientation: {
        100: {
            question: "This sexual orientation describes attraction to people of the opposite sex and is often shortened to 'straight'.",
            answer: "What is heterosexual?"
        },
        200: {
            question: "This orientation involves attraction between same-sex individuals, including men to men and women to women.",
            answer: "What is homosexual?"
        },
        300: {
            question: "This sexual orientation involves attraction to people of more than one gender, encompassing men, women, and non-binary individuals.",
            answer: "What is bisexual?"
        },
        400: {
            question: "People with this orientation do not experience sexual attraction toward individuals of any gender and are sometimes known as 'ace'.",
            answer: "What is asexual?"
        },
        500: {
            question: "This orientation refers to someone attracted to all people regardless of their gender identity.",
            answer: "What is pansexual?"
        }
    },
    components: {
        100: {
            question: "This component of sexuality involves awareness and feeling about your own body and others' bodies, enabling physical pleasure and attraction.",
            answer: "What is sensuality?"
        },
        200: {
            question: "This component is the ability to be emotionally close to another human being and involves sharing, caring, and vulnerability.",
            answer: "What is sexual intimacy?"
        },
        300: {
            question: "This aspect includes a person's understanding of who they are sexually, including gender identity, gender role, and sexual orientation.",
            answer: "What is sexual identity?"
        },
        400: {
            question: "This component encompasses a person's capacity to reproduce and the behaviors that make sexual relationships healthy and enjoyable.",
            answer: "What is reproduction and sexual health?"
        },
        500: {
            question: "Often called the 'shadowy' side of human sexuality, this aspect involves using sexual behavior to influence, manipulate, or control others.",
            answer: "What is sexualization?"
        }
    },
    harassment: {
        100: {
            question: "This Republic Act, enacted in 1995, declares sexual harassment unlawful in employment, education, and training environments.",
            answer: "What is Republic Act 7877 (Anti-Sexual Harassment Act)?"
        },
        200: {
            question: "According to Philippine statistics, this many cases of sexual harassment at the workplace were reported to the PNP between 2016-2021.",
            answer: "What is 421 cases?"
        },
        300: {
            question: "These three forms of sexual harassment include physical harassment, this type involving requests for sexual favors, and use of objects or pictures.",
            answer: "What is verbal harassment?"
        },
        400: {
            question: "The penalty for sexual harassment violators includes imprisonment of 1-6 months or a fine between these two amounts in Philippine pesos.",
            answer: "What is P10,000 to P20,000?"
        },
        500: {
            question: "Sexual harassment may occur in workplace premises, during official business, at training sessions, or through these modern communication methods.",
            answer: "What are telephone, cellular phone, fax machine, or electronic mail?"
        }
    }
};

// Game state
let gameState = {
    answered: new Set(),
    currentQuestion: null
};

// DOM elements
const modal = document.getElementById('questionModal');
const questionText = document.getElementById('questionText');
const answerText = document.getElementById('answerText');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const closeBtn = document.getElementById('closeBtn');
const closeSpan = document.getElementById('closeSpan');

// Sound effects (optional - can be added later)
function playSound(type) {
    // Placeholder for sound effects
    // Could add audio files later for click, reveal, etc.
}

// Animation utilities
function addRippleEffect(element, event) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Initialize game
function initializeGame() {
    // Add click listeners to all question cells
    document.querySelectorAll('.question-cell').forEach(cell => {
        cell.addEventListener('click', handleQuestionClick);
    });

    // Modal event listeners
    showAnswerBtn.addEventListener('click', showAnswer);
    closeBtn.addEventListener('click', closeModal);
    closeSpan.addEventListener('click', closeModal);
    
    // Close modal when clicking backdrop
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (modal.style.display === 'block') {
            switch(event.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'Enter':
                case ' ':
                    if (showAnswerBtn.style.display !== 'none') {
                        showAnswer();
                    }
                    break;
            }
        }
    });

    // Add entrance animations to question cells
    animateQuestionCells();
}

// Animate question cells on load
function animateQuestionCells() {
    const cells = document.querySelectorAll('.question-cell');
    cells.forEach((cell, index) => {
        cell.style.opacity = '0';
        cell.style.transform = 'translateY(50px) rotateX(-90deg)';
        
        setTimeout(() => {
            cell.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            cell.style.opacity = '1';
            cell.style.transform = 'translateY(0) rotateX(0)';
        }, index * 100);
    });
}

// Handle question cell clicks
function handleQuestionClick(event) {
    const cell = event.currentTarget;
    
    // Prevent interaction if already answered
    if (cell.classList.contains('answered')) {
        return;
    }
    
    // Add ripple effect
    addRippleEffect(cell, event);
    
    // Get question data
    const category = cell.dataset.category;
    const points = cell.dataset.points;
    const questionId = `${category}-${points}`;
    
    // Check if question exists
    if (!questions[category] || !questions[category][points]) {
        console.error('Question not found:', category, points);
        return;
    }
    
    // Store current question
    gameState.currentQuestion = {
        category,
        points,
        id: questionId,
        element: cell
    };
    
    // Show question modal
    showQuestion(questions[category][points]);
    
    // Mark as answered
    markAsAnswered(cell, questionId);
}

// Show question in modal
function showQuestion(questionData) {
    questionText.textContent = questionData.question;
    answerText.querySelector('.answer-content').textContent = questionData.answer;
    
    // Reset modal state
    answerText.style.display = 'none';
    showAnswerBtn.style.display = 'inline-flex';
    
    // Show modal with animation
    modal.style.display = 'block';
    modal.classList.add('modal-entering');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        modal.classList.remove('modal-entering');
    }, 400);
    
    // Focus on show answer button for accessibility
    setTimeout(() => {
        showAnswerBtn.focus();
    }, 100);
}

// Show answer
function showAnswer() {
    answerText.style.display = 'block';
    showAnswerBtn.style.display = 'none';
    
    // Add entrance animation to answer
    answerText.style.opacity = '0';
    answerText.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        answerText.style.transition = 'all 0.4s ease';
        answerText.style.opacity = '1';
        answerText.style.transform = 'translateY(0)';
    }, 50);
    
    // Focus on close button
    closeBtn.focus();
}

// Mark question as answered
function markAsAnswered(cell, questionId) {
    setTimeout(() => {
        cell.classList.add('answered');
        gameState.answered.add(questionId);
        
        // Add completion animation
        cell.style.animation = 'completionPulse 0.6s ease';
        
        setTimeout(() => {
            cell.style.animation = '';
        }, 600);
        
        // Check if game is complete
        checkGameCompletion();
    }, 1000);
}

// Close modal
function closeModal() {
    modal.classList.add('modal-exiting');
    
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('modal-exiting');
        
        // Reset answer display
        answerText.style.opacity = '';
        answerText.style.transform = '';
        answerText.style.transition = '';
        
        gameState.currentQuestion = null;
    }, 300);
}

// Check if all questions are answered
function checkGameCompletion() {
    const totalQuestions = 20; // 4 categories × 5 questions each
    
    if (gameState.answered.size === totalQuestions) {
        setTimeout(() => {
            showCompletionMessage();
        }, 1500);
    }
}

// Show game completion message
function showCompletionMessage() {
    const completionModal = document.createElement('div');
    completionModal.className = 'completion-modal';
    completionModal.innerHTML = `
        <div class="completion-content">
            <div class="completion-header">
                <i class="fas fa-trophy"></i>
                <h2>Congratulations!</h2>
            </div>
            <p>You've completed all questions in Knowledge Quest!</p>
            <p class="completion-subtitle">Great job learning about Sex & Sexuality!</p>
            <div class="completion-stats">
                <div class="stat">
                    <span class="stat-number">20</span>
                    <span class="stat-label">Questions Answered</span>
                </div>
                <div class="stat">
                    <span class="stat-number">4</span>
                    <span class="stat-label">Categories Mastered</span>
                </div>
            </div>
            <button class="completion-btn" onclick="location.reload()">
                <i class="fas fa-redo"></i>
                Play Again
            </button>
        </div>
    `;
    
    document.body.appendChild(completionModal);
    
    // Add completion styles if not already present
    if (!document.querySelector('#completion-styles')) {
        const style = document.createElement('style');
        style.id = 'completion-styles';
        style.textContent = `
            .completion-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.5s ease;
            }
            .completion-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px;
                border-radius: 25px;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
                animation: modalSlideIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .completion-header {
                margin-bottom: 30px;
            }
            .completion-header i {
                font-size: 4rem;
                color: #feca57;
                margin-bottom: 15px;
                display: block;
                animation: bounce 1s ease infinite alternate;
            }
            .completion-header h2 {
                font-size: 2.5rem;
                margin: 0;
                color: white;
            }
            .completion-content p {
                font-size: 1.2rem;
                color: rgba(255, 255, 255, 0.9);
                margin: 10px 0;
            }
            .completion-subtitle {
                font-style: italic;
                color: #feca57 !important;
            }
            .completion-stats {
                display: flex;
                justify-content: space-around;
                margin: 30px 0;
            }
            .stat {
                text-align: center;
            }
            .stat-number {
                display: block;
                font-size: 2.5rem;
                font-weight: bold;
                color: #4facfe;
            }
            .stat-label {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.8);
            }
            .completion-btn {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                color: white;
                border: none;
                padding: 15px 30px;
                font-size: 1.1rem;
                border-radius: 50px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                margin-top: 20px;
                transition: all 0.3s ease;
            }
            .completion-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            }
            @keyframes bounce {
                from { transform: translateY(0px); }
                to { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add CSS for additional animations
function addAdditionalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes completionPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .modal-entering .modal-content {
            animation: modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .modal-exiting .modal-content {
            animation: modalSlideOut 0.3s ease;
        }
        @keyframes modalSlideOut {
            from {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
        }
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    addAdditionalStyles();
    
    // Add some loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}