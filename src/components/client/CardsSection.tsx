// components/CardsSection.tsx
'use client';

import React, {useState} from 'react';
import Title from '@/components/ui/Title';
import Button from '@/components/ui/Button';
import Paragraph from '@/components/ui/Paragraph';
import NavigationButtons from "@/components/global/NavigationButtons";

import CustomModal from "@/components/global/CustomModal";
import Gallery from '../ui/Gallery';

type CardProps = {
    text: string;
};

const Card: React.FC<CardProps> = ({ text }) => {
    return (
        <div className="rounded-md overflow-hidden shadow-sm bg-white">
            <div className="w-full h-40 bg-gray-300" />
            <div className="p-4">
                <p className="text-sm text-gray-800">{text}</p>
                <p className="mt-2 text-sm italic text-black hover:underline cursor-pointer">More</p>
            </div>
        </div>
    );
};

export default function CardsSection() {

    const dummyText =
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a';

    const [currentIndex, setCurrentIndex] = useState(0);
    const totalItems = 4;

    return (
        <section className="pt-[200px] py-12 px-4 md:px-8 lg:px-16 bg-[#f9f9f9]">
            <h2 className={'text-black underline mb-8'}>Title Component</h2>

            <Title tag='h2' fontFamily='var(--var-dc--font-mono)' spanColor='var(--var-dc--error-color)' color='var(--var-dc--background)' textAlign='center'>
                In publishing and graphic design, Lorem ipsum is a <span>placeholder text</span> commonly used to demonstrate the visual form of a document
            </Title>
            <br/><br/><br/>
            <h2 className={'text-black underline mb-8'}>Modal/Button Component</h2>
            <div className="flex flex-column-col gap-4 sm:gap-4 md:gap-8 lg:gap-16 xl:gap-24 2xl:gap-32 justify-space-between items-center justify-center mt-10">]">
                <CustomModal modalType={'team'} title={'Team Modal'}/>
                <CustomModal modalType={'popup'} title={"Popup Modal"}/>
                <CustomModal modalType={'video'} title={'Video Modal'}/>
                <Button
                    text='Learn More'
                    background='var(--var-dc--primary-color)'
                    hoverBackground='var(--var-dc--secondary-color)'
                    color='#FFF'
                    hoverColor='#FFF'
                    fontSize={18}
                    borderRadius={8}
                    margin="30px 0 30px 0"
                    fontWeight={500}
                    border='1px solid var(--var-dc--primary-color)'
                    onClick={() => window.alert('Button clicked')}
                />
            </div>


            <h2 className={'text-black mt-8 underline mb-8'}>Text/Paragraph Component</h2>

            <div className='flex justify-space-between items-center justify-center'>
                <Paragraph
                    textOne="Lorem ipsum dolor sit amet, <span>consectetur adipiscing</span> elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque. Sed vitae sapien euismod, cursus erat at, dictum erat. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque."
                    textTwo="<b>Suspendisse potenti</b>. Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque elit. Sed ut imperdiet nisi. Proin condimentum fermentum nunc. Etiam pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque."
                    fontSize="18px"
                    color="#333"
                    fontWeight="400"
                    lineHeight="1.7"
                    letterSpacing="0.01em"
                    fontFamily="var(--var-dc--font-secondary)"
                    gap="gap-4 sm:gap-4 md:gap-8 lg:gap-16 xl:gap-24 2xl:gap-32"
                    margin='0 0 60px 0'
                    spanColor='var(--var-dc--primary-color)'
                    spanFontFamily='var(--var-dc--font-mono)'
                    spanFontSize='20px'
                    spanFontWeight='700'
                />
            </div>


            <h2 className={'text-black underline mb-8'}>Card/Box Component</h2>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} text={dummyText}/>
                ))}
            </div>


            <h2 className={'text-black underline mt-8 mb-8'}>Gallery/Media/Video Component</h2>
            <div className=' gallery flex justify-space-between items-center justify-center'>
                <Gallery/>
            </div>


            <h2 className={'text-black underline mt-8 mb-8'}>Navigation Buttons Component</h2>

            <NavigationButtons
                prevLiClassName="slider1-prev"
                nextLiClassName="slider1-next"
                prevLiId="slider1-prev-btn"
                nextLiId="slider1-next-btn"
                isBeginning={currentIndex === 0}
                isEnd={currentIndex === totalItems - 1}
                onPrevious={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                onNext={() => setCurrentIndex(prev => Math.min(totalItems - 1, prev + 1))}
                size={44}                          // Button size in px (number or string, e.g. '3rem')
                svgColor="#fff"                    // Arrow color (default: white)
                backgroundColor="#0070f3"          // Button background color (default: blue)
                borderRadius="50%"                // Border radius (e.g. '50%' for circle, '16px' for rounded square)
                hoverSvgColor="#ffffff"               // Arrow color on hover (default: white)
                hoverBackgroundColor="#0051a3"     // Button background color on hover
                disabledBackgroundColor="#ccc"     // Background color when disabled
                className="my-custom-class"        // Any extra classes you want to add
                padding="12px"
                margin="6px"
                gap="0px"
            />
        </section>
    );
}
