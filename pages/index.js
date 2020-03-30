const Index = () => (
    <div>
      <p>Sample app using React and Next.js</p>
    </div>
  );
  
  export default Index;

// //Get the List of Images
// let imageList = document.querySelector('.container__container-img-list');

// let images = document.querySelectorAll('.container__container-img-list-item');

// /* Add Event Listenr to right button */
// let imageWidth = images[0].clientWidth;

// images.forEach((e, i) => {
//     e.style.left = i * imageWidth + "px";
// });

// let rightBtn = document.querySelector(".btn-right");

// let leftBtn = document.querySelector(".btn-left");


// rightBtn.addEventListener('click', (e) => {

//     let activeImg = imageList.querySelector('.active');
//     let siblingImg = activeImg.nextElementSibling === null ? imageList.firstElementChild : activeImg.nextElementSibling;

//     imageList.style.transform = "translateX(-" + siblingImg.style.left + ")";

//     activeImg.classList.remove('active');
//     siblingImg.classList.add('active');

// });

// leftBtn.addEventListener('click', (e) => {

//     let activeImg = imageList.querySelector('.active');
//     console.log(activeImg.style.left);
//     let siblingImg = activeImg.nextElementSibling === null ? imageList.firstElementChild : activeImg.nextElementSibling;

//     imageList.style.transform = "translateX(-" + siblingImg.style.left + ")";

//     activeImg.classList.remove('active');
//     siblingImg.classList.add('active');

// });


