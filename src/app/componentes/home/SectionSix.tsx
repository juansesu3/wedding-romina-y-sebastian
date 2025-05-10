import React from 'react';

const images = [
  'https://my-page-negiupp.s3.amazonaws.com/1746726537861.JPG',
  'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
  'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
  'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
  'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
  'https://my-page-negiupp.s3.amazonaws.com/1746726537861.JPG',
  'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
  'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
  
];

const SectionSix = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Imagen ${index + 1}`}
            className="w-full h-auto object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default SectionSix;
