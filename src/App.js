import { useEffect, useRef } from "react";

let catdog = { x: 0, y: 0, speed: 1 };
let corrdinate = { offsetX: 0, offsetY: 0 };
let fps, fpsInterval, now, then, elapsed;
let image1 = true;
let isSleeping = false;
let timeoutExecuted = false;
let debounceTime;

export default function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight - 2;
    canvas.style.backgroundColor = "#f4f4f4";

    const ctx = canvas.getContext("2d");

    ctxRef.current = ctx;

    const imageObj = new window.Image();
    imageObj.src = "/images/catdog.svg";
    imageObj.addEventListener("load", () => {
      run(imageObj);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const catdogChaseMouse = ({ nativeEvent: { offsetX, offsetY } }) => {
    timeoutExecuted = false;
    isSleeping = false;
    function debounce(cb) {
      if (debounceTime) {
        cb();
      }
      setTimeout(() => {
        debounceTime = true;
      }, 500);
    }
    debounce(() => {
      //slight move doesnt cause catdog movement
      if (
        Math.abs(offsetX) - catdog.x > 20 ||
        Math.abs(offsetX) - catdog.x < -20
      ) {
        corrdinate.offsetX = offsetX;
      }
      if (
        Math.abs(offsetY) - catdog.y > 20 ||
        Math.abs(offsetY) - catdog.y < -20
      ) {
        corrdinate.offsetY = offsetY;
      }
    });
  };

  const run = (imageObj) => {
    fps = 5;
    fpsInterval = 1000 / fps;
    then = performance.now();

    const update = () => {
      requestAnimationFrame(update);

      now = performance.now();
      elapsed = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        //x axis chase
        if (corrdinate.offsetX > catdog.x) {
          catdog.x += catdog.speed;
        } else {
          catdog.x -= catdog.speed;
        }

        //y axis chase
        if (corrdinate.offsetY > catdog.y) {
          catdog.y += catdog.speed;
        } else {
          catdog.y -= catdog.speed;
        }

        //x axis is still
        if (
          corrdinate.offsetX - catdog.x <= catdog.speed &&
          corrdinate.offsetX - catdog.x >= -catdog.speed
        ) {
          catdog.x = corrdinate.offsetX;
        }

        //y axis is sitll
        if (
          corrdinate.offsetY - catdog.y <= catdog.speed &&
          corrdinate.offsetY - catdog.y >= -catdog.speed
        ) {
          catdog.y = corrdinate.offsetY;
        }

        //walls collision
        if (catdog.x > canvasRef.current.width - 30) {
          catdog.x = canvasRef.current.width - 30;
          corrdinate.offsetX = canvasRef.current.width - 30;
        }
        if (catdog.y > canvasRef.current.height - 30) {
          catdog.y = canvasRef.current.height - 30;
          corrdinate.offsetY = canvasRef.current.height - 30;
        }

        ctxRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        //sleep, normal, mouse is out
        if (
          corrdinate.offsetX === catdog.x &&
          corrdinate.offsetY === catdog.y
        ) {
          if (isSleeping) {
            drawSprite(imageObj, 92, 0, 137, 0);
          } else {
            drawSprite(imageObj, 92, 90, 137, 90);

            if (!timeoutExecuted) {
              setTimeout(() => {
                isSleeping = true;
              }, 2000);
              timeoutExecuted = true;
            }
          }
          return;
        }
        //goes to east
        if (corrdinate.offsetX > catdog.x && corrdinate.offsetY === catdog.y)
          drawSprite(imageObj, 0, 0, 40, 0);
        //goes to south
        if (corrdinate.offsetX === catdog.x && corrdinate.offsetY > catdog.y)
          drawSprite(imageObj, 92, 40, 137, 40);
        //goes to west
        if (corrdinate.offsetX < catdog.x && corrdinate.offsetY === catdog.y)
          drawSprite(imageObj, 92, 180, 137, 180);
        //goes to north
        if (corrdinate.offsetX === catdog.x && corrdinate.offsetY < catdog.y)
          drawSprite(imageObj, 0, 90, 45, 90);
        //goes to north-east
        if (corrdinate.offsetX > catdog.x && corrdinate.offsetY < catdog.y)
          drawSprite(imageObj, 0, 45, 40, 45);
        //goes to south-east
        if (corrdinate.offsetX > catdog.x && corrdinate.offsetY > catdog.y)
          drawSprite(imageObj, 0, 180, 40, 180);
        //goes to south-west
        if (corrdinate.offsetX < catdog.x && corrdinate.offsetY > catdog.y)
          drawSprite(imageObj, 92, 135, 137, 135);
        //goes to north-west
        if (corrdinate.offsetX < catdog.x && corrdinate.offsetY < catdog.y)
          drawSprite(imageObj, 0, 135, 40, 135);
      }
    };
    update();
  };

  const drawSprite = (
    imageObj,
    firstImageX,
    firstImageY,
    secondImageX,
    secondImageY
  ) => {
    if (image1) {
      ctxRef.current.drawImage(
        imageObj,
        firstImageX,
        firstImageY,
        50,
        50,
        catdog.x,
        catdog.y,
        40,
        40
      );
    } else {
      ctxRef.current.drawImage(
        imageObj,
        secondImageX,
        secondImageY,
        50,
        50,
        catdog.x,
        catdog.y,
        40,
        40
      );
    }
    image1 = !image1;
  };
  return <canvas ref={canvasRef} onMouseMove={catdogChaseMouse} />;
}
