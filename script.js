// Digital Detox Relaxation Website
// Translation system
const translations = {
    en: {
        title: 'Digital Detox',
        subtitle: 'Disconnect to Reconnect',
        'minutes-of-calm': 'Minutes of calm',
        'begin-session': 'Begin Session',
        pause: 'Pause',
        resume: 'Resume',
        reset: 'Reset',
        'session-duration': 'Session Duration:',
        '5-minutes': '5 minutes',
        '10-minutes': '10 minutes',
        '15-minutes': '15 minutes',
        '30-minutes': '30 minutes',
        'enable-sound': '🔇 Enable Sound',
        'disable-sound': '🔊 Disable Sound',
        volume: 'Volume:',
        breathe: 'Breathe',
        'breathe-in': 'Breathe In',
        hold: 'Hold',
        'breathe-out': 'Breathe Out',
        'welcome-title': 'Welcome to Your Digital Detox',
        'welcome-description': 'Take this time to disconnect from digital distractions and reconnect with inner calm.',
        'prepare-title': 'To prepare for your session:',
        'instruction-1': '📱 Put your phone in another room or airplane mode',
        'instruction-2': '💻 Close all social media tabs and notifications',
        'instruction-3': '🧘 Find a comfortable, quiet space',
        'instruction-4': '🌬️ Focus on slow, deep breathing',
        'instruction-5': '🧠 Allow your mind to naturally settle and calm',
        'instruction-6': '🎧 Use headphones for the best audio experience',
        'start-journey': 'Start Your Journey',
        'session-complete': '🌟 Session Complete!',
        'session-complete-desc': "Congratulations! You've successfully completed your digital detox session.",
        'session-complete-notice': 'Take a moment to notice how you feel. Your mind should now be more calm and ready for focused work.',
        continue: 'Continue'
    },
    es: {
        title: 'Desintoxicación Digital',
        subtitle: 'Desconéctate para Reconectar',
        'minutes-of-calm': 'Minutos de calma',
        'begin-session': 'Comenzar Sesión',
        pause: 'Pausar',
        resume: 'Continuar',
        reset: 'Reiniciar',
        'session-duration': 'Duración de la Sesión:',
        '5-minutes': '5 minutos',
        '10-minutes': '10 minutos',
        '15-minutes': '15 minutos',
        '30-minutes': '30 minutos',
        'enable-sound': '🔇 Activar Sonido',
        'disable-sound': '🔊 Desactivar Sonido',
        volume: 'Volumen:',
        breathe: 'Respira',
        'breathe-in': 'Inhala',
        hold: 'Mantén',
        'breathe-out': 'Exhala',
        'welcome-title': 'Bienvenido a tu Desintoxicación Digital',
        'welcome-description': 'Tómate este tiempo para desconectarte de las distracciones digitales y reconectar con la calma interior.',
        'prepare-title': 'Para prepararte para tu sesión:',
        'instruction-1': '📱 Pon tu teléfono en otra habitación o en modo avión',
        'instruction-2': '💻 Cierra todas las pestañas de redes sociales y notificaciones',
        'instruction-3': '🧘 Encuentra un espacio cómodo y silencioso',
        'instruction-4': '🌬️ Enfócate en una respiración lenta y profunda',
        'instruction-5': '🧠 Permite que tu mente se calme naturalmente',
        'instruction-6': '🎧 Usa auriculares para la mejor experiencia de audio',
        'start-journey': 'Comienza tu Viaje',
        'session-complete': '🌟 ¡Sesión Completada!',
        'session-complete-desc': '¡Felicitaciones! Has completado exitosamente tu sesión de desintoxicación digital.',
        'session-complete-notice': 'Tómate un momento para notar cómo te sientes. Tu mente ahora debería estar más calmada y lista para el trabajo enfocado.',
        continue: 'Continuar'
    }
};

class DigitalDetox {
    constructor() {
        this.timer = null;
        this.totalTime = 15 * 60; // Default 15 minutes in seconds
        this.currentTime = this.totalTime;
        this.isRunning = false;
        this.isPaused = false;
        this.audioContext = null;
        this.whiteNoiseNode = null;
        this.gainNode = null;
        this.isAudioEnabled = false;
        this.currentLanguage = this.detectLanguage();
        
        this.initializeElements();
        this.initializeLanguage();
        this.bindEvents();
        this.generateWhiteNoise();
    }

    initializeElements() {
        // Timer elements
        this.timerMinutes = document.getElementById('timer-minutes');
        this.timerSeconds = document.getElementById('timer-seconds');
        
        // Control buttons
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        
        // Session controls
        this.durationSelect = document.getElementById('duration');
        this.audioToggle = document.getElementById('audio-toggle');
        this.volumeControl = document.getElementById('volume');
        
        // UI elements
        this.progressBar = document.getElementById('progress-bar');
        this.breathingGuide = document.getElementById('breathing-guide');
        this.breathingText = document.getElementById('breathing-text');
        this.instructions = document.getElementById('instructions');
        this.closeInstructions = document.getElementById('close-instructions');
        
        // Audio element
        this.whiteNoiseAudio = document.getElementById('white-noise');
        
        // Language elements
        this.langButtons = document.querySelectorAll('.lang-btn');
    }

    bindEvents() {
        // Control buttons
        this.startBtn.addEventListener('click', () => this.startSession());
        this.pauseBtn.addEventListener('click', () => this.pauseSession());
        this.resetBtn.addEventListener('click', () => this.resetSession());
        
        // Session controls
        this.durationSelect.addEventListener('change', (e) => this.changeDuration(e.target.value));
        this.audioToggle.addEventListener('click', () => this.toggleAudio());
        this.volumeControl.addEventListener('input', (e) => this.changeVolume(e.target.value));
        
        // Instructions
        this.closeInstructions.addEventListener('click', () => this.closeInstructionsOverlay());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Language buttons
        this.langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLanguage(e.target.dataset.lang));
        });
        
        // Breathing guide
        this.startBreathingGuide();
    }

    generateWhiteNoise() {
        try {
            // Create AudioContext
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create white noise buffer
            const bufferSize = this.audioContext.sampleRate * 2;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Generate white noise
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            // Create buffer source
            this.whiteNoiseNode = this.audioContext.createBufferSource();
            this.whiteNoiseNode.buffer = buffer;
            this.whiteNoiseNode.loop = true;
            
            // Create gain node for volume control
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = 0; // Start muted
            
            // Connect nodes
            this.whiteNoiseNode.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            
            // Start the white noise (it won't be audible until gain > 0)
            this.whiteNoiseNode.start();
            
        } catch (error) {
            console.log('AudioContext not supported, falling back to HTML5 audio');
            // Fallback to HTML5 audio element
            this.whiteNoiseAudio.volume = 0;
        }
    }

    toggleAudio() {
        if (!this.isAudioEnabled) {
            this.enableAudio();
        } else {
            this.disableAudio();
        }
    }

    enableAudio() {
        this.isAudioEnabled = true;
        this.updateAudioButtonText();
        this.audioToggle.style.background = 'rgba(244, 67, 54, 0.8)';
        
        // Resume AudioContext if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Set volume based on slider
        this.changeVolume(this.volumeControl.value);
    }

    disableAudio() {
        this.isAudioEnabled = false;
        this.updateAudioButtonText();
        this.audioToggle.style.background = 'rgba(76, 175, 80, 0.8)';
        
        if (this.gainNode) {
            this.gainNode.gain.value = 0;
        }
        if (this.whiteNoiseAudio) {
            this.whiteNoiseAudio.volume = 0;
        }
    }

    updateAudioButtonText() {
        const key = this.isAudioEnabled ? 'disable-sound' : 'enable-sound';
        this.audioToggle.textContent = translations[this.currentLanguage][key];
    }

    changeVolume(value) {
        const volume = value / 100;
        
        if (this.isAudioEnabled) {
            if (this.gainNode) {
                // Web Audio API
                this.gainNode.gain.value = volume * 0.3; // Keep it subtle
            } else if (this.whiteNoiseAudio) {
                // HTML5 Audio fallback
                this.whiteNoiseAudio.volume = volume * 0.3;
                if (volume > 0) {
                    this.whiteNoiseAudio.play().catch(e => console.log('Audio play failed:', e));
                } else {
                    this.whiteNoiseAudio.pause();
                }
            }
        }
    }

    changeDuration(minutes) {
        if (!this.isRunning) {
            this.totalTime = minutes * 60;
            this.currentTime = this.totalTime;
            this.updateTimerDisplay();
            this.updateProgress();
        }
    }

    startSession() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            
            // Update UI
            this.startBtn.style.display = 'none';
            this.pauseBtn.style.display = 'inline-block';
            document.body.classList.add('session-active');
            this.breathingGuide.classList.add('active');
            
            // Start timer
            this.timer = setInterval(() => {
                this.currentTime--;
                this.updateTimerDisplay();
                this.updateProgress();
                
                if (this.currentTime <= 0) {
                    this.completeSession();
                }
            }, 1000);
        } else if (this.isPaused) {
            this.resumeSession();
        }
    }

    pauseSession() {
        if (this.isRunning && !this.isPaused) {
            this.isPaused = true;
            clearInterval(this.timer);
            
            // Update UI
            this.startBtn.style.display = 'inline-block';
            this.startBtn.textContent = translations[this.currentLanguage]['resume'];
            this.pauseBtn.style.display = 'none';
        }
    }

    resumeSession() {
        if (this.isRunning && this.isPaused) {
            this.isPaused = false;
            
            // Update UI
            this.startBtn.style.display = 'none';
            this.pauseBtn.style.display = 'inline-block';
            
            // Resume timer
            this.timer = setInterval(() => {
                this.currentTime--;
                this.updateTimerDisplay();
                this.updateProgress();
                
                if (this.currentTime <= 0) {
                    this.completeSession();
                }
            }, 1000);
        }
    }

    resetSession() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timer);
        
        // Reset time
        this.currentTime = this.totalTime;
        
        // Update UI
        this.startBtn.style.display = 'inline-block';
        this.startBtn.textContent = translations[this.currentLanguage]['begin-session'];
        this.pauseBtn.style.display = 'none';
        document.body.classList.remove('session-active');
        this.breathingGuide.classList.remove('active');
        
        // Update displays
        this.updateTimerDisplay();
        this.updateProgress();
    }

    completeSession() {
        // Stop audio when session completes
        this.disableAudio();
        
        this.resetSession();
        
        // Show completion message
        this.showCompletionMessage();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        
        this.timerMinutes.textContent = minutes.toString().padStart(2, '0');
        this.timerSeconds.textContent = seconds.toString().padStart(2, '0');
    }

    updateProgress() {
        const progress = ((this.totalTime - this.currentTime) / this.totalTime) * 100;
        this.progressBar.style.width = progress + '%';
    }

    startBreathingGuide() {
        let phase = 0; // 0: inhale, 1: hold, 2: exhale, 3: hold
        const phaseKeys = ['breathe-in', 'hold', 'breathe-out', 'hold'];
        const durations = [4000, 1000, 4000, 1000]; // in milliseconds
        
        const updateBreathingText = () => {
            const phaseText = translations[this.currentLanguage][phaseKeys[phase]];
            this.breathingText.textContent = phaseText;
            
            setTimeout(() => {
                phase = (phase + 1) % 4;
                updateBreathingText();
            }, durations[phase]);
        };
        
        updateBreathingText();
    }

    closeInstructionsOverlay() {
        this.instructions.classList.add('hidden');
    }

    showCompletionMessage() {
        // Create completion overlay
        const completion = document.createElement('div');
        completion.className = 'instructions';
        completion.innerHTML = `
            <div class="instructions-content">
                <h2>${translations[this.currentLanguage]['session-complete']}</h2>
                <p>${translations[this.currentLanguage]['session-complete-desc']}</p>
                <p>${translations[this.currentLanguage]['session-complete-notice']}</p>
                <button class="btn primary" onclick="this.parentElement.parentElement.remove()">${translations[this.currentLanguage]['continue']}</button>
            </div>
        `;
        document.body.appendChild(completion);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (completion.parentElement) {
                completion.remove();
            }
        }, 10000);
    }

    handleKeyPress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (!this.isRunning) {
                    this.startSession();
                } else if (!this.isPaused) {
                    this.pauseSession();
                } else {
                    this.resumeSession();
                }
                break;
            case 'KeyR':
                e.preventDefault();
                this.resetSession();
                break;
            case 'KeyA':
                e.preventDefault();
                this.toggleAudio();
                break;
            case 'Escape':
                if (!this.instructions.classList.contains('hidden')) {
                    this.closeInstructionsOverlay();
                }
                break;
        }
    }

    // Language detection and translation methods
    detectLanguage() {
        // Check stored preference first
        const storedLang = localStorage.getItem('detox-language');
        if (storedLang && translations[storedLang]) {
            return storedLang;
        }
        
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.toLowerCase().split('-')[0];
        
        // Check if Spanish-speaking region
        const spanishRegions = ['es', 'mx', 'ar', 'co', 've', 'pe', 'ec', 'gt', 'cu', 'bo', 'do', 'hn', 'py', 'sv', 'ni', 'cr', 'pa', 'uy', 'gq'];
        
        if (spanishRegions.includes(langCode)) {
            return 'es';
        }
        
        return 'en'; // Default to English
    }

    initializeLanguage() {
        this.translatePage();
        this.updateLanguageButtons();
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.translatePage();
        this.updateLanguageButtons();
        
        // Update dynamic elements
        this.updateAudioButtonText();
        
        // Update document language
        document.getElementById('html-root').lang = lang;
        
        // Store preference
        localStorage.setItem('detox-language', lang);
    }

    updateLanguageButtons() {
        this.langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
        });
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.dataset.i18n;
            if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
                element.textContent = translations[this.currentLanguage][key];
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalDetox();
});

// Prevent context menu and text selection for cleaner experience
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

// Handle visibility change to pause when tab is not active
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.detoxApp && window.detoxApp.isRunning && !window.detoxApp.isPaused) {
        // Optionally pause when tab becomes hidden
        // window.detoxApp.pauseSession();
    }
});

// Store app instance globally for debugging
window.addEventListener('load', () => {
    if (!window.detoxApp) {
        window.detoxApp = new DigitalDetox();
    }
});