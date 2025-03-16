let alarmTimeout;
let alarmSound = document.getElementById('alarmSound');
let difficulty = 1;
let attempts = 3;
let currentQuestion = '';
let correctAnswer = '';

// تعيين مستوى الصعوبة
function setDifficulty(level) {
    difficulty = level;
    alert(`تم تعيين المستوى: ${['سهل', 'متوسط', 'صعب'][level-1]}`);
}

// تفعيل المنبه
function setAlarm() {
    const alarmTime = document.getElementById('alarmTime').value;
    if (!alarmTime) {
        alert('⏰ الرجاء اختيار وقت المنبه!');
        return;
    }

    const now = new Date();
    const [hours, minutes] = alarmTime.split(':');
    const alarmDate = new Date(now);
    alarmDate.setHours(hours, minutes, 0, 0);

    let timeUntilAlarm = alarmDate - now;

    // إذا كان الوقت قد فات، أضف يومًا
    if (timeUntilAlarm < 0) {
        alarmDate.setDate(alarmDate.getDate() + 1);
        timeUntilAlarm = alarmDate - now;
    }

    startAlarm(timeUntilAlarm);
}

// بدء المنبه
function startAlarm(timeUntilAlarm) {
    if (alarmTimeout) clearTimeout(alarmTimeout);

    // تغيير الرنة المختارة
    const selectedTone = document.getElementById('alarmTone').value;
    alarmSound.src = selectedTone;

    alarmTimeout = setTimeout(() => {
        if (alarmSound.src) {
            alarmSound.play().catch(error => {
                alert('حدث خطأ في تشغيل الصوت: ' + error.message);
            });
            togglePages();
            generateQuestion();
            document.getElementById('remaining-attempts').textContent = `المحاولات المتبقية: ${attempts}`;
        } else {
            alert('⚠️ الرجاء اختيار رنة أولاً!');
        }
    }, timeUntilAlarm);
}

// تبديل الصفحات
function togglePages() {
    const mainPage = document.getElementById('mainPage');
    const alarmPage = document.getElementById('alarmPage');
    mainPage.style.display = mainPage.style.display === 'none' ? 'block' : 'none';
    alarmPage.style.display = alarmPage.style.display === 'none' ? 'block' : 'none';
}

// إيقاف المنبه
function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    togglePages();
    clearTimeout(alarmTimeout);
    attempts = 3; // إعادة تعيين المحاولات
}

// إنشاء سؤال بناءً على المستوى
function generateQuestion() {
    const questionData = generateQuestionByDifficulty();
    currentQuestion = questionData.question;
    correctAnswer = questionData.answer;

    document.getElementById('math-question').textContent = currentQuestion;
    document.getElementById('user-answer').value = ''; // مسح الإجابة السابقة
    document.getElementById('feedback-message').textContent = ''; // مسح التغذية الراجعة
}

// توليد أسئلة حسب المستوى
function generateQuestionByDifficulty() {
    switch(difficulty) {
        case 1: // سهل
            return generateBasicQuestion();
        case 2: // متوسط
            return generateIntermediateQuestion();
        case 3: // صعب
            return generateAdvancedQuestion();
    }
}

// أسئلة المستوى السهل
function generateBasicQuestion() {
    const types = [
        () => { // عمليات حسابية بسيطة
            const a = randomInt(1, 10);
            const b = randomInt(1, 10);
            const operator = ['+', '-', '*'][randomInt(0, 2)];
            return {
                question: `ما نتيجة ${a} ${operator} ${b}؟`,
                answer: eval(`${a} ${operator} ${b}`).toString()
            };
        },
        () => { // مسائل الأشكال الهندسية
            const shape = ['مربع', 'مستطيل', 'مثلث'][randomInt(0, 2)];
            const a = randomInt(1, 10);
            const b = randomInt(1, 10);
            let question, answer;
            switch(shape) {
                case 'مربع':
                    question = `ما مساحة مربع طول ضلعه ${a}؟`;
                    answer = (a * a).toString();
                    break;
                case 'مستطيل':
                    question = `ما مساحة مستطيل طوله ${a} وعرضه ${b}؟`;
                    answer = (a * b).toString();
                    break;
                case 'مثلث':
                    question = `ما مساحة مثلث قاعدته ${a} وارتفاعه ${b}؟`;
                    answer = ((a * b) / 2).toString();
                    break;
            }
            return { question, answer };
        },
        () => { // معادلات خطية
            const a = randomInt(1, 5);
            const b = randomInt(1, 10);
            return {
                question: `حل المعادلة: ${a}x + ${b} = ${a*2 + b}`,
                answer: '2'
            };
        }
    ];
    return types[randomInt(0, types.length-1)]();
}

// أسئلة المستوى المتوسط
function generateIntermediateQuestion() {
    const types = [
        () => { // عمليات حسابية مركبة
            const a = randomInt(1, 10);
            const b = randomInt(1, 10);
            const c = randomInt(1, 10);
            return {
                question: `ما نتيجة (${a} + ${b}) * ${c}؟`,
                answer: ((a + b) * c).toString()
            };
        },
        () => { // حسابات مركبة على الجذور والقوى
            const a = randomInt(1, 5);
            const b = randomInt(2, 3);
            return {
                question: `ما قيمة الجذر التربيعي لـ ${a ** 2}؟`,
                answer: a.toString()
            };
        },
        () => { // مسائل المتتاليات العددية
            const start = randomInt(1, 10);
            const step = randomInt(1, 5);
            const n = randomInt(3, 5);
            const sequence = Array.from({ length: n }, (_, i) => start + i * step);
            return {
                question: `ما الحد التالي في المتتالية: ${sequence.join(', ')}؟`,
                answer: (start + n * step).toString()
            };
        }
    ];
    return types[randomInt(0, types.length-1)]();
}

// أسئلة المستوى الصعب
function generateAdvancedQuestion() {
    const types = [
        () => { // تحويلات زمنية
            const hours = randomInt(1, 12);
            const minutes = randomInt(0, 59);
            return {
                question: `كم دقيقة في ${hours}:${minutes.toString().padStart(2,'0')}؟`,
                answer: (hours * 60 + minutes).toString()
            };
        },
        () => { // مسائل النسب والتناسب
            const a = randomInt(1, 10);
            const b = randomInt(1, 10);
            const c = randomInt(1, 10);
            return {
                question: `إذا كانت النسبة بين ${a} و ${b} هي ${a}:${b}، فما هي النسبة بين ${a} و ${c}؟`,
                answer: `${a}:${c}`
            };
        },
        () => { // ألغاز رياضية
            const a = randomInt(1, 10);
            const b = randomInt(1, 10);
            return {
                question: `إذا كان ${a} + ${b} = ${a + b}، فما هو ${a} * ${b}؟`,
                answer: (a * b).toString()
            };
        }
    ];
    return types[randomInt(0, types.length-1)]();
}

// دوال مساعدة
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function combination(n, k) {
    return factorial(n)/(factorial(k)*factorial(n-k));
}

function factorial(num) {
    return num <= 1 ? 1 : num * factorial(num-1);
}

// التحقق من الإجابة
function checkAnswer() {
    const userAnswer = document.getElementById('user-answer').value.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.toString().toLowerCase();
    
    if(userAnswer === normalizedCorrect) {
        stopAlarm();
        showFeedback('إجابة صحيحة! ✓', 'success');
    } else {
        attempts--;
        if(attempts <= 0) {
            attempts = 3; // إعادة تعيين المحاولات
            generateQuestion(); // تغيير السؤال
            showFeedback('انتهت المحاولات! سيتم تغيير السؤال.', 'warning');
        } else {
            showFeedback(`إجابة خاطئة. المحاولات المتبقية: ${attempts}`, 'warning');
        }
    }
}

// إظهار التغذية الراجعة
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback-message');
    feedback.textContent = message;
    feedback.className = `text-${type} fw-bold`;
}