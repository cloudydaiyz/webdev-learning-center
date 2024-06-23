// Questions container
const allQuestions = document.querySelectorAll('div.questions div.qa');
const gettingStartedQuestions = document.querySelectorAll('div.questions div.qa.getting-started-q');
const pricingQuestions = document.querySelectorAll('div.questions div.qa.pricing-q');

allQuestions.forEach((questionContainer) => {
    console.log('container');
    const question = questionContainer.children.item(0);
    question.addEventListener('click', () => {
        questionContainer.classList.toggle('active');
    });
});

// Categorizing questions
const allQuestionsBtn = document.querySelector('div.faq div.tab button.all');
const gettingStartedQuestionsBtn = document.querySelector('div.faq div.tab button.gs');
const pricingQuestionsBtn = document.querySelector('div.faq div.tab button.pricing');

allQuestionsBtn.addEventListener('click', () => {
    allQuestions.forEach((questionContainer) => {
        questionContainer.classList.remove('hidden');
    });
});

gettingStartedQuestionsBtn.addEventListener('click', () => {
    // Hide all questions
    allQuestions.forEach((questionContainer) => {
        questionContainer.classList.add('hidden');
    });

    // Show only the getting started questions
    gettingStartedQuestions.forEach((questionContainer) => {
        questionContainer.classList.remove('hidden');
    });
});

pricingQuestionsBtn.addEventListener('click', () => {
    // Hide all questions
    allQuestions.forEach((questionContainer) => {
        questionContainer.classList.add('hidden');
    });

    // Show only the getting started questions
    pricingQuestions.forEach((questionContainer) => {
        questionContainer.classList.remove('hidden');
    });
});