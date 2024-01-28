'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const ToolBar = () => {
    const [images, setImages] = useState([]);
    const [showImages, setShowImages] = useState(false);
    const [showTexts, setShowTexts] = useState(false);
    const [text, setText] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('https://api.quotable.io/quotes');
                const data = await res.json();
                setText(data.results);
            } catch (error) {
                console.error('Error');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('https://picsum.photos/v2/list');
                const data = await res.json();
                setImages(data);
            } catch (error) {
                console.error('Error');
            }
        };
        fetchData();
    }, []);

    const toggleImages = () => {
        setShowImages(!showImages);
        setShowTexts(false);
    };

    const toggleTexts = () => {
        setShowTexts(!showTexts);
        setShowImages(false);
    };

    const handleDragStart = (event, id) => {
        event.dataTransfer.setData('text/plain', id);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const dropZone = event.target;
        const isText = data.length > 3;

        if (isText) {
            const paragraph = document.createElement('p');
            paragraph.textContent = data;
            paragraph.className = 'draggable-element';
            dropZone.appendChild(paragraph);
        } else {
            const image = document.createElement('img');
            image.src = `https://picsum.photos/id/${data}/5000/3333`;
            image.alt = 'Dropped Image';
            image.width = 250;
            image.height = 250;
            image.className = 'draggable-element my-3 rounded-md';
            dropZone.appendChild(image);
        }
    };

    const renderDraggableElements = () => {
        return showImages
            ? images.map((image) => (
                  <Image
                      key={image.id}
                      draggable
                      onDragStart={(event) => handleDragStart(event, image.id)}
                      src={image.download_url}
                      width={250}
                      height={250}
                      className='my-3 mx-2 rounded-md draggable-element'
                  />
              ))
            : showTexts
            ? text.map((quote) => (
                  <p
                      key={quote.id}
                      draggable
                      onDragStart={(event) => handleDragStart(event, quote.content)}
                      className='h-36 w-1/2 p-3 draggable-element'
                  >
                      {quote.content}
                  </p>
              ))
            : null;
    };

    return (
        <div className='min-h-screen w-full flex relative'>
            <div className='min-h-screen w-[40%] bg-blue-800'>
                <div className='w-full h-24 flex justify-between px-2 py-4'>
                    <button
                        className='px-5 py-3 bg-yellow-600 rounded-md h-fit'
                        onClick={toggleTexts}
                    >
                        Text
                    </button>
                    <button
                        className='px-5 py-3 bg-yellow-600 rounded-md h-fit'
                        onClick={toggleImages}
                    >
                        Images
                    </button>
                </div>
                <div className='h-full w-full flex justify-around flex-wrap gap-3 overflow-hidden'>
                    {renderDraggableElements()}
                </div>
            </div>
            <div className='h-screen w-[60%] bg-red-400 fixed top-0 right-0'>
                <div className='w-full h-24 flex px-2 py-4'>
                    <button className='px-5 py-3 bg-green-600 rounded-md h-fit'>
                        Save
                    </button>
                </div>
                <div className='h-full w-full flex-col p-5'>
                    {[1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className='h-[27%] w-[90%] flex justify-around gap-5 mb-5'
                            onDrop={handleDrop}
                            onDragOver={(event) => event.preventDefault()}
                        >
                            <div
                                className='h-full w-2/4 drop-zone border-4 border-dashed rounded-md border-zinc-500 justify-center items-center flex text-center p-2'
                            ></div>
                            <div
                                className='h-full w-2/4 drop-zone border-4 border-dashed rounded-md border-zinc-500 justify-center items-center flex text-center p-2'
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ToolBar;
