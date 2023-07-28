"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

type carouselType = {
    title: string,
    textA: string,
    textB: string,
    poster: string
}

const mockCarousel: Array<carouselType> = [
    {
        title: "Halwa",
        textA: "The Brand New Halwa!",
        textB: "Savour every bite.",
        poster: "https://placehold.co/600x400"
    },
    {
        title: "Laddu",
        textA: "The Brand New Laddu!",
        textB: "Savour every bite.",
        poster: "https://placehold.co/600x400"
    },
    {
        title: "Ganja",
        textA: "The Brand New Ganja!",
        textB: "Savour every bite.",
        poster: "https://placehold.co/600x400"
    },
    {
        title: "Laptop",
        textA: "The Brand New Laptop!",
        textB: "Savour every Moment.",
        poster: "https://placehold.co/600x400"
    },
    {
        title: "Dress",
        textA: "The Brand New Dress!",
        textB: "Savour every Style.",
        poster: "https://placehold.co/600x400"
    },
    {
        title: "Shoes",
        textA: "The Brand New Shoes!",
        textB: "Savour every Step.",
        poster: "https://placehold.co/600x400"
    }
]

const Carousel = () => {
    const [carousel, setCarousel] = useState<Array<carouselType>>(mockCarousel)
    const [currentSlide, setCurrentSlide] = useState<number>(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev === mockCarousel.length - 1) ? 0 : prev + 1);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    return (
        <div className="px-4 sm:px-[8em] py-2 flex justify-center flex-col sm:flex-row gap-2 sm:gap-10 w-full">
            <div className="w-full h-[250px] sm:h-[400px] bg-red-500 flex justify-evenly items-center flex-col-reverse sm:flex-row rounded-xl relative overflow-hidden">
                <span className='text-[1.5em] sm:text-[3em] font-bold w-full p-2'>{carousel[currentSlide]?.textA} <br /> {carousel[currentSlide]?.textB}</span>
                <Image
                    loader={() => carousel[currentSlide]?.poster!}
                    unoptimized
                    src={carousel[currentSlide]?.poster!}
                    alt='img'
                    fill={true}
                    style={{ objectFit: "cover" }}
                    className='!relative' />
            </div>

            <div className="flex justify-between sm:w-1/8 sm:flex-col gap-2 px-[5em] sm:px-0">
                {mockCarousel?.map((obj: carouselType, index: number) => {
                    return <div
                        style={index === currentSlide ? { backgroundColor: "var(--primary)", color: "#fff" } : {}}
                        className="bg-secondaryClr w-[10px] h-[10px] sm:w-[150px] sm:h-full flex_center rounded-full sm:rounded-md cursor-pointer"
                        onClick={() => setCurrentSlide(index)}
                        key={index}>
                        <span className='hidden sm:block text-[1em] font-bold'>{obj?.title}</span>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Carousel