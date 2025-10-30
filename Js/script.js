//--تعاریف
const numberLimitedEl = document.querySelector('.counter');
const textareaEl = document.querySelector('.form__textarea');
const formBox = document.querySelector('.form');
const feedsEl = document.querySelector('.feedbacks');
const loadingEl = document.querySelector('.spinner');
const submitEl = document.querySelector('.submit-btn');
const hashtagListEl = document.querySelector('.hashtags');




// --کد های گلوبال
const Num = 150;
const Time = 2000;
const baseOfApi = 'https://bytegrad.com/course-assets/js/1/api';
const feedItems = (FeedbackItem) => {
    const feedbackComments = `
    <li class="feedback">
        <button class="upvote">
            <i class="fa-solid fa-caret-up upvote__icon"></i>
            <span class="upvote__count">${FeedbackItem.upvoteCount}</span>
        </button>
        <section class="feedback__badge">
            <p class="feedback__letter">${FeedbackItem.badgeLetter}</p>
        </section>
        <div class="feedback__content">
            <p class="feedback__company">${FeedbackItem.company}</p>
            <p class="feedback__text">${FeedbackItem.text}</p>
        </div>
        <p class="feedback__date">${FeedbackItem.daysAgo === 0 ? 'New' : FeedbackItem.daysAgo + 'd'}</p>
    </li>`;

    feedsEl.insertAdjacentHTML('beforeend', feedbackComments);
};



// --شروع لیمیت عدد در فرم
const numberLimit = () => {

    const MaxLimit = Num;
    const CharsNum = textareaEl.value.length;
    const NumberLi = MaxLimit - CharsNum;
    numberLimitedEl.textContent = NumberLi;

};
textareaEl.addEventListener('input', numberLimit);
// --پایان لیمیت عدد در فرم




// --شروع دکمه ی ثبت شدن

const Ali = (style) => {
    formBox.classList.remove(style);
}

const funcForSubmit = (event) => {
    event.preventDefault();

    if (textareaEl.value.includes('#') && textareaEl.value.length >= 5) {
        formBox.classList.add('form--valid');
        setTimeout(() => Ali('form--valid'), Time);

    } else {
        formBox.classList.add('form--invalid');
        setTimeout(() => Ali('form--invalid'), Time);
        textareaEl.focus();
        return
    }

    //-- برای انجام کار ها بر روی اطلاعات
    const hashtagFilter = textareaEl.value.split(' ').find(word => word.includes('#'));

    const company = hashtagFilter.substring(1);

    const badgeLetter = company.substring(0, 1).toUpperCase();


    const upvoteCount = 0;

    const daysAgo = 0;

    //-- کد های ساختن کامنت
    const submitInfos = {
        company: company,
        badgeLetter: badgeLetter,
        upvoteCount: upvoteCount,
        text: textareaEl.value,
        daysAgo: daysAgo,
    }
    feedItems(submitInfos);
    fetch(`${baseOfApi}/feedbacks`, {
        method: 'POST',
        body: JSON.stringify(submitInfos),
        headers: {
            accept: 'application/JSON',
            'Content-Type': 'application/JSON'
        }
    })
        .then(Response => {
            if (!Response.ok) {
                console.log('the comment not submitted');

            } else { console.log('comment submitted') }

        }).catch(Error => {
            console.log(Error);
        })


    textareaEl.value = '';

    submitEl.blur();

    numberLimitedEl.textContent = Num;

};


formBox.addEventListener('submit', funcForSubmit);
// --پایان دکمه ی ثبت شدن

fetch(`${baseOfApi}/feedbacks`)
    .then(Response => {
        return Response.json();
    })
    .then(Data => {

        Data.feedbacks.forEach(Feeditem => {

            const submitInfos = {
                company: Feeditem.company,
                badgeLetter: Feeditem.badgeLetter,
                upvoteCount: Feeditem.upvoteCount,
                text: Feeditem.text,
                daysAgo: Feeditem.daysAgo,
            }
            feedItems(submitInfos);

            loadingEl.remove();
        });


    })
    .catch(Error => {
        feedsEl.textContent = `the  feeds  going  to  a  problem  ( we have an Error ) , the Error Message : ${Error.message}  `;

    })
//شروع تنظیم باز شدن متن هنگام کلیک و تنظیم لایک ها 

const clickFeedsElHandler = clickHandler => {
    const clickedEl = clickHandler.target;
    const upvoteEl = clickedEl.className.includes('upvote');
    if (upvoteEl) {
        const upvoteBtnEl = clickedEl.closest('.upvote');
        upvoteBtnEl.disabled = true;
        // Find the specific upvote count element within the same feedback item
        const upVoteCountEl = upvoteBtnEl.querySelector('.upvote__count');
        let upvoteNum = upVoteCountEl.textContent;
        let upVoteCorrect = Number(upvoteNum);
        upVoteCountEl.textContent = ++upVoteCorrect;
        

            } else {
                clickedEl.closest('.feedback').classList.toggle('feedback--expand');
            }
};

feedsEl.addEventListener('click', clickFeedsElHandler);

//پایان تنظیم باز شدن متن هنگام کلیک و تنظیم لایک ها


// شروع تنظیم هشتگ ها در سرچ کامنت ها

const HashtagClickHandler = event => {
    const clickedEl = event.target.textContent;
    if (clickedEl.className === 'hashtags') return;
    const companyNameHashtag = clickedEl.substring(1).trim().toLowerCase();
    feedsEl.childNodes.forEach(childNode =>{
        if (childNode.nodeType === 3) return;
        const feedbackCompanyName = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();
        console.log(feedbackCompanyName);
        if (feedbackCompanyName !== companyNameHashtag) {
            childNode.remove();
        }
       
    })
} 
hashtagListEl.addEventListener('click', HashtagClickHandler); 


// پایان تنظیم هشتگ ها در سرچ کامنت ها