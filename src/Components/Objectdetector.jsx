import React, { useRef, useState } from "react";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSSd from "@tensorflow-models/coco-ssd";
import Targetbox from "./Targetbox";

function Objectdetector(props) {
  const fileInputRef = useRef();
  // used to take file as input and it ref
  const [imgData, setimgData] = useState(null);
  //used to set predictions
  const [predict, setpredict] = useState([]);
  // for normalization
 const imgRef=useRef();
 // for processing
 const[processing,setprocessing]=useState(false)

  // if not able to get predictions
  const isEmptypredictions = !predict || predict.length === 0;

  const openFilepicker = () => {
    // 1
    console.log("clicked");
    if (fileInputRef.current) {
      // if not null take a file
      fileInputRef.current.click();
    }
  };

  // dataasurl convert image as bas64 data

  const readImage = (file) => {
    //2
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = () => reject(fileReader.error);
      fileReader.readAsDataURL(file);
    });
  };

  const onselectImage = async (e) => {
    //3 uses 2
    setpredict([])
    setprocessing(true)

    const file = e.target.files[0]; // only taking one file
    const imageData = await readImage(file); // getting file as url
    setimgData(imageData);

    const imageElement = document.createElement("img");
    imageElement.src = imageData;
    

    imageElement.onload = async () => {
      const imgSize={width:imageElement.width,height:imageElement.height}
      await detectImage(imageElement,imgSize);
      setprocessing(false)
    }; //?
  };

  const detectImage = async (imgelement,imgSize) => {
    //4 uses 5
    // import the model
    const model = await cocoSSd.load({});
    const predictions = await model.detect(imgelement, 6); // no of boxes on img more boxes less eff
    const normalizedPredict=normalizePredictions(predictions,imgSize)
    setpredict(normalizedPredict);
    console.log("Predctions", predictions);
  };

  // const targetBoxes
  // getting the values of  postion where box should be placed

  const normalizePredictions=(predictions,imgSize)=>{ //5
    if(!predictions || !imgSize || !imgRef){
      return predictions|| []; // if predictions are zero
    }
    else{
      return predictions.map((prediction)=>{
        const {bbox}=prediction;
        const oldX=bbox[0];
        const oldY=bbox[1];
        const oldWidth=bbox[2];
        const oldHeight=bbox[3];
    
        const imgWidth=imgRef.current.width;
        const imgHeight=imgRef.current.height
    
    
        // new val of bounding box
        const x =(oldX * imgWidth)/imgSize.width     
        const y=(oldY * imgHeight)/imgSize.height
        const width=(oldWidth * imgWidth)/imgSize.width
        const height=(oldHeight * imgHeight)/imgSize.height
    
    
        // now evey new  value will be mapped
        return{...prediction,bbox:[x,y,width,height]} 
        })
    }
  }



  return (
    <>
      <div className="Container flex   flex-col items-center justify-center ">
        {/* taking position */}

        <div className="dectector min-w-[200px] mt-5 min-h-[400px] border-2 border-solid border-black rounded-md   text-2xl font-semibold flex content-center items-center relative text-black text-center">
          {/* // which holds the image */}
          {
            // making sure imgdata is valid
            imgData && <img src={imgData} alt="" className="h-[700px] "  ref={imgRef}/>
          }
          {/* taking image */}

          {!isEmptypredictions &&
            predict.map((prediction, idx) => (
              <Targetbox
                key={idx}
                x={prediction.bbox[0]}
                y={prediction.bbox[1]}
                width={prediction.bbox[2]}
                height={prediction.bbox[3]}
                classType={prediction.class.toUpperCase()}
                score={prediction.score*100}
              />
            ))}
        </div>

        {/* // taking file */}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={onselectImage}
        />
        <button
          onClick={openFilepicker}
          className="p-4 bg-[#6495ED] font-bold text-white text-lg mt-3 hover:bg-slate-50 hover:text-black outline-none  rounded-lg"
        >
         {processing ?"Processing...":" Pick UP Image"}
        </button>
      
      </div>

      {/* // used to make boxes on predictions as pos=absolute as it places above the img */}
    </>
  );
}

export default Objectdetector;
