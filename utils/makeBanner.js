const puppeteer = require("puppeteer");

const makeBanner = async (
  backgroundImg,
  shape,
  customShape,
  fontName,
  fontColor,
  textSize,
  borderColor,
  backgroundColor,
  containerBackgroundImg,
  icon1Img,
  icon2Img,
  icon3Img,
  iconsColor,
  textPosition,
  members,
  inVc,
  boosters
) => {
  const returnShape = (shape) => {
    if (shape === "custom") {
      return ` -webkit-mask-box-image: url(${customShape});`;
    }

    if (shape === "circle") {
      return `border-radius: 50%;`;
    }

    if (shape === "square") {
      return `border-radius: 10px;`;
    }

    if (shape === "square-rounded") {
      return `border-radius: 20px;`;
    }
  };

  const assignTextPos = (assignTextPos) => {
    switch (assignTextPos) {
      case "top-center":
        return `justify-content: center;
                align-items: flex-start;`;
      case "top-right":
        return `justify-content: flex-end;
                align-items: flex-start;`;
      case "center-right":
        return `justify-content: flex-end;
                align-items: center;`;
      case "bottom-right":
        return `justify-content: flex-end;
                align-items: flex-end;`;
      case "bottom-center":
        return `justify-content: center;
                align-items: flex-end;`;
      case "bottom-left":
        return `justify-content: flex-start;
                 align-items: flex-end;`;
      case "center-left":
        return `justify-content: flex-start;
                align-items: center;`;
      case "top-left":
        return `justify-content: flex-start;
                align-items: flex-start;`;
      case "center-center":
        return `justify-content: center;
                align-items: center;`;
    }
  };

  const frameBackground = (containerBackgroundImage) => {
    if (!containerBackgroundImage) return;
    return `background-image: url(${containerBackgroundImg});`;
  };

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 960,
    height: 540,
    deviceScaleFactor: 1,
  });
  await page.setDefaultNavigationTimeout(0);
  await page.setContent(
    `
      <!DOCTYPE html>
      <head>
      <style>
      @import url("https://fonts.googleapis.com/css2?family=Play:wght@700&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");
      @import url('https://fonts.googleapis.com/css2?family=Russo+One&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@900&display=swap');
      body {
        margin: 0;
      }

      .banner {
        width: 960px;
        height: 540px;
        padding-top: 140px;
        background-image: url(${backgroundImg});
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .containers {
        position: relative;
        display: flex;
        justify-content: space-around;
        width: 90%;
      }

      .stat__container-shadow {
        background-color: #000;
        width: 248px;
        height: 248px;
        ${returnShape(shape)}
        overflow: visible;
      }

      .stat__container-border {
        display: grid;
        place-items: center;
        background-color: ${borderColor};
        width: 245px;
        height: 245px;
        ${returnShape(shape)}
      }
      
      .stat__container {
        width: 220px;
        height: 220px;
        background-color: ${backgroundColor};
        background-color: ${backgroundColor};
        display: flex;
        ${assignTextPos(textPosition)}
        ${
          backgroundColor == "Custom"
            ? frameBackground(containerBackgroundImg)
            : ""
        }
        background-position: center;
        background-size: cover;
        ${returnShape(shape)}
      }
      

      .stat__number {
        margin: 0;
        font-family: ${fontName};
        font-size: ${textSize}px;
        color: ${fontColor};
        ${
          fontColor !== "#000"
            ? `filter: drop-shadow(4px 4px 0 black) 
          drop-shadow(-4px -4px 0 black);`
            : ""
        }
          
      }

      .icons {
        display: flex;
        justify-content: space-around;
        width: 90%;
      }

      .icon {
        position: relative;
        width: 100px;
        height: 100px;
      }

      .icon-border-1 {
        width: 102px;
        height: 102px;
        background-color: black;
        -webkit-mask-box-image: url(${icon1Img});
       }
 
       .icon-1 {       
         -webkit-mask-box-image: url(${icon1Img});        
         background-color: ${iconsColor};
         background-repeat: no-repeat;
         background-size: cover;
       }
 
       .icon-border-2 {
         min-width: 102px;
         min-height: 102px;
         background-color: black;
         -webkit-mask-box-image: url(${icon2Img});
         background-size: cover;
       }
 
       .icon-2 {
         -webkit-mask-box-image: url(${icon2Img});
         background-color: ${iconsColor};
         background-repeat: no-repeat;
         background-size: cover;
       }
 
       .icon-border-3 {
         width: 102px;
         height: 102px;
         background-color: black;
         -webkit-mask-box-image: url(${icon3Img});
       }
 
       .icon-3 {
         -webkit-mask-box-image: url(${icon3Img});
         background-color: ${iconsColor};
         background-repeat: no-repeat;
         background-size: cover;
       }
 
      .watermark {
        margin: 0 400px 0 0;
        font-family: Play;
        font-size: 44px;
        color: ${iconsColor};
        filter: drop-shadow(3px 3px 0 black) 
          drop-shadow(-3px -3px 0 black);
      }
    </style>
      </head>
    
      <body>
        <div class="banner">
          <div class="containers">
          <div class="stat__container-shadow"> <div class="stat__container-border"><div class="stat__container">
          <p class="stat__number">${members}</p>
        </div></div></div>
        <div class="stat__container-shadow"> <div class="stat__container-border"><div class="stat__container">
          <p class="stat__number">${inVc}</p>
        </div></div></div>
        <div class="stat__container-shadow"> <div class="stat__container-border"><div class="stat__container">
          <p class="stat__number">${boosters}</p>
        </div></div></div>
          </div>
          <div class="icons">
          <div class="icon-border-1"><div class="icon icon-1"></div></div>
          <div class="icon-border-2"><div class="icon icon-2"></div></div>
          <div class="icon-border-3"><div class="icon icon-3"></div></div>
          </div>
          <p class="watermark">bannerBot Alpha 0.7.2</p>
        </div>
      </body>
    </html>    

`,
    { "waitUntil": "networkidle0" }
  );
  const banner = await page.screenshot().catch((err) => console.error(err));
  browser.close();
  return banner;
};

module.exports = makeBanner;
