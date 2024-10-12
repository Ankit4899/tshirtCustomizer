import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import * as htmlToImage from 'html-to-image';
import './App.css';


const TShirtCustomizer = () => {
  const [designImage, setDesignImage] = useState(null);
  const [tshirtImage] = useImage('/tshirt.jpg'); // Path to your T-shirt mockup image
  const [uploadedDesign] = useImage(designImage);
  const [selectedId, selectShape] = useState(null);
  const stageRef = useRef();

  // Handle file upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesignImage(URL.createObjectURL(file));
    }
  };

  // Handle download of the preview
  const handleDownload = () => {
    htmlToImage
      .toPng(stageRef.current.getStage().container())
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'tshirt-preview.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to download image', err);
      });
  };

  // Transformer component for resizing and rotating the design
  const DesignTransformer = ({ selectedShape }) => {
    const transformerRef = useRef();

    useEffect(() => {
      if (selectedShape) {
        transformerRef.current.nodes([selectedShape]);
        transformerRef.current.getLayer().batchDraw();
      }
    }, [selectedShape]);

    return <Transformer ref={transformerRef} />;
  };

  return (
    <div>
      <h1>T-Shirt Customizer</h1>
      <input type="file" accept="image/*" onChange={handleUpload} />

      <div style={{ marginTop: '20px', border: '1px solid #ccc', display: 'inline-block' }}>
        <Stage width={200} height={300} ref={stageRef}>
          <Layer>

            <KonvaImage image={tshirtImage} width={200} height={300} />


            {uploadedDesign && (
              <KonvaImage
                image={uploadedDesign}
                x={50}
                y={100}
                width={70}
                height={100}
                draggable
                onClick={(e) => {
                  selectShape(e.target);
                }}
                onTap={(e) => {
                  selectShape(e.target);
                }}
              />
            )}

          
            {selectedId && <DesignTransformer selectedShape={selectedId} />}
          </Layer>
        </Stage>
      </div>

      <button className="btn" onClick={handleDownload} style={{ marginTop: '20px' }}>
        Download design
      </button>
    </div>
  );
};

export default TShirtCustomizer;
