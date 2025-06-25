'use client'
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "framer-motion";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import VideoPlayerWrapper from "@/components/client/VideoPlayerWrapper";
import Img from "@/components/ui/Img";
import Button from "@/components/ui/Button";

interface MyComponentProps {
    modalType: string;
    title: string;
    teamId?: string; // Add teamId prop for team modals
}

const MyComponent: React.FC<MyComponentProps> = ({ modalType, teamId = "team-1",title }) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    // Check URL on component mount and handle URL changes
    useEffect(() => {
        if (modalType === "team") {
            // Check if modal should be open based on URL
            const checkUrlForModal = () => {
                const urlParams = new URLSearchParams(window.location.search);
                const modalParam = urlParams.get('modal');
                if (modalParam === teamId) {
                    setModalIsOpen(true);
                }
            };

            // Check on mount
            checkUrlForModal();

            // Listen for back/forward browser navigation
            const handlePopState = () => {
                checkUrlForModal();
            };

            window.addEventListener('popstate', handlePopState);

            return () => {
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [modalType, teamId]);

    // Handle modal open/close for team modals with URL management
    const handleModalToggle = (open: boolean) => {
        if (modalType === "team") {
            const url = new URL(window.location.href);

            if (open) {
                // Add team ID to URL
                url.searchParams.set('modal', teamId);
                window.history.pushState({}, '', url.toString());
            } else {
                // Remove team ID from URL
                url.searchParams.delete('modal');
                window.history.pushState({}, '', url.toString());
            }
        }
        setModalIsOpen(open);
    };

    // Create portal root and prevent body scroll when modal is open
    useEffect(() => {
        // Create or get the portal root element
        let portalElement = document.getElementById('modal-portal-root');
        if (!portalElement) {
            portalElement = document.createElement('div');
            portalElement.id = 'modal-portal-root';
            portalElement.style.position = 'relative';
            portalElement.style.zIndex = '10000';
            document.body.appendChild(portalElement);
        }
        setPortalRoot(portalElement);

        return () => {
            // Clean up portal element if component unmounts
            const element = document.getElementById('modal-portal-root');
            if (element && element.children.length === 0) {
                document.body.removeChild(element);
            }
        };
    }, []);

    useEffect(() => {
        if (modalIsOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [modalIsOpen]);

    const overlayVariants = {
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren" as const,
                duration: 0.3,
                delayChildren: 0.1
            }
        },
        hidden: {
            opacity: 0,
            transition: {
                when: "afterChildren" as const,
                duration: 0.3,
                delay: 0.1
            }
        }
    };



    const ModalContent: React.FC = () => (
        <AnimatePresence>
            {modalIsOpen && (
                <motion.div
                    className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black bg-opacity-40 flex items-center justify-center z-[10000] p-5 box-border"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={overlayVariants}

                >
                    <motion.div
                        className="max-w-full w-3/4 max-h-[80vh] bg-white rounded-lg shadow-xl  relative"
                        initial={{ y: "100vh" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100vh" }}
                        transition={{ duration: 0.5 }}
                    >
                        {modalType === "team" && (
                            <div className="team-modal">
                                <div className="flex w-full border-b border-gray-300 p-4">
                                    <h3 className="text-gray-800 text-2xl leading-8 font-medium tracking-normal flex-1">
                                        Mr Mohammed Jahangir Alam
                                    </h3>
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => handleModalToggle(false)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="21.414"
                                            height="21.414"
                                            viewBox="0 0 21.414 21.414"
                                        >
                                            <g
                                                id="Group_13674"
                                                data-name="Group 13674"
                                                transform="translate(-1224.793 -42.793)"
                                            >
                                                <line
                                                    id="Line_1"
                                                    data-name="Line 1"
                                                    x2="28.284"
                                                    transform="translate(1225.5 43.5) rotate(45)"
                                                    fill="none"
                                                    stroke="#222"
                                                    strokeLinecap="round"
                                                    strokeWidth="1"
                                                />
                                                <line
                                                    id="Line_2"
                                                    data-name="Line 2"
                                                    x2="28.284"
                                                    transform="translate(1225.5 63.5) rotate(-45)"
                                                    fill="none"
                                                    stroke="#222"
                                                    strokeLinecap="round"
                                                    strokeWidth="1"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                                    <div className="flex flex-wrap -mx-4">
                                        <div className="w-full md:w-5/12 px-4">
                                            <div className="modal-data__img">
                                                <img
                                                    src="/images/static/blur.jpg"
                                                    alt="Profile"
                                                    className="w-full h-auto"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full md:w-7/12 px-4 pb-32  ">
                                            {typeof window !== 'undefined' && window.innerWidth > 767 ? (
                                                <SimpleBar
                                                    autoHide={true}
                                                    style={{ maxHeight: '60vh' }}
                                                >
                                                    <p className="mb-4 text-gray-800">Director</p>
                                                    <p className="mb-4 text-gray-800">
                                                        After completing graduation Mr.
                                                        Mohammad Ashrafuzzaman joined family business of trading in construction
                                                        materials like C. I. Sheet. M. S. Rod, Cement etc. In his twenty-eight
                                                        years of trading business, he acquired much experience later on and appeared as
                                                        an industrial entrepreneur.
                                                    </p>
                                                    <br />
                                                    <p className="mb-4 text-gray-800">
                                                        At present he is holding the directorship
                                                        of GPH Ispat Limited, GPH Power Generation Limited, GPH Ship Builders
                                                        Limited, GPH Engineers &amp; Development Limited, Jahangir &amp; Others Limited
                                                        and National Cement Mills Limited. He is also a sponsor shareholder of M. I.
                                                        Cement Factory Limited (Crown Cement). Currently, he is shouldering the
                                                        responsibility as the Managing Director of Eco Ceramics Industries Limited, an auto
                                                        ceramic bricks manufacturing unit. He is also running a trading firm as its sole
                                                        proprietor.
                                                    </p>
                                                    <br /><br />
                                                    <p className="mb-4 text-gray-800">
                                                        Moreover, he is engaged in different social
                                                        activities by associating himself with some national and international
                                                        social benevolent organizations.
                                                    </p>
                                                </SimpleBar>
                                            ) : (
                                                <div>
                                                    <p className="mb-4 text-gray-800">Director</p>
                                                    <p className="mb-4 text-gray-800">
                                                        After completing graduation Mr.
                                                        Mohammad Ashrafuzzaman joined family business of trading in construction
                                                        materials like C. I. Sheet. M. S. Rod, Cement etc. In his twenty-eight
                                                        years of trading business, he acquired much experience later on and appeared as
                                                        an industrial entrepreneur.
                                                    </p>
                                                    <br />
                                                    <p className="mb-4 text-gray-800">
                                                        At present he is holding the directorship
                                                        of GPH Ispat Limited, GPH Power Generation Limited, GPH Ship Builders
                                                        Limited, GPH Engineers &amp; Development Limited, Jahangir &amp; Others Limited
                                                        and National Cement Mills Limited. He is also a sponsor shareholder of M. I.
                                                        Cement Factory Limited (Crown Cement). Currently, he is shouldering the
                                                        responsibility as the Managing Director of Eco Ceramics Industries Limited, an auto
                                                        ceramic bricks manufacturing unit. He is also running a trading firm as its sole
                                                        proprietor.
                                                    </p>
                                                    <br /><br />
                                                    <p className="mb-4 text-gray-800">
                                                        Moreover, he is engaged in different social
                                                        activities by associating himself with some national and international
                                                        social benevolent organizations.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {
                            modalType=="popup" &&
                            <div className={'popup'}>
                                <div className="flex w-full border-b border-gray-300 p-4">

                                    <div
                                        className="cursor-pointer"
                                        onClick={() => setModalIsOpen(false)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="21.414"
                                            height="21.414"
                                            viewBox="0 0 21.414 21.414"
                                        >
                                            <g
                                                id="Group_13674"
                                                data-name="Group 13674"
                                                transform="translate(-1224.793 -42.793)"
                                            >
                                                <line
                                                    id="Line_1"
                                                    data-name="Line 1"
                                                    x2="28.284"
                                                    transform="translate(1225.5 43.5) rotate(45)"
                                                    fill="none"
                                                    stroke="#222"
                                                    strokeLinecap="round"
                                                    strokeWidth="1"
                                                />
                                                <line
                                                    id="Line_2"
                                                    data-name="Line 2"
                                                    x2="28.284"
                                                    transform="translate(1225.5 63.5) rotate(-45)"
                                                    fill="none"
                                                    stroke="#222"
                                                    strokeLinecap="round"
                                                    strokeWidth="1"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 pt-4">
                                    <div className="flex flex-wrap -mx-4">
                                        <div className="w-full md:w-12/12 px-4">
                                            <div className="modal-data__img">
                                                <Img
                                                    alt="Profile"
                                                    srcLg="/images/static/blur.jpg"
                                                    widthPx={400}
                                                    heightPx={130}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full md:w-12/12 px-4 pt-4 pb-32  ">
                                            {typeof window !== 'undefined' && window.innerWidth > 767 ? (
                                                <SimpleBar
                                                    autoHide={true}
                                                    style={{maxHeight: '60vh'}}
                                                >
                                                    <p className="mb-4 text-gray-800">Director</p>
                                                    <p className="mb-4 text-gray-800">
                                                        After completing graduation Mr.
                                                        Mohammad Ashrafuzzaman joined family business of trading in
                                                        construction
                                                        materials like C. I. Sheet. M. S. Rod, Cement etc. In his
                                                        twenty-eight
                                                        years of trading business, he acquired much experience later on
                                                        and appeared as
                                                        an industrial entrepreneur.
                                                    </p>
                                                    <br/>
                                                    <p className="mb-4 text-gray-800">
                                                        At present he is holding the directorship
                                                        of GPH Ispat Limited, GPH Power Generation Limited, GPH Ship
                                                        Builders
                                                        Limited, GPH Engineers &amp; Development Limited,
                                                        Jahangir &amp; Others Limited
                                                        and National Cement Mills Limited. He is also a sponsor
                                                        shareholder of M. I.
                                                        Cement Factory Limited (Crown Cement). Currently, he is
                                                        shouldering the
                                                        responsibility as the Managing Director of Eco Ceramics
                                                        Industries Limited, an auto
                                                        ceramic bricks manufacturing unit. He is also running a trading
                                                        firm as its sole
                                                        proprietor.
                                                    </p>
                                                    <br/><br/>
                                                    <p className="mb-4 text-gray-800">
                                                        Moreover, he is engaged in different social
                                                        activities by associating himself with some national and
                                                        international
                                                        social benevolent organizations.
                                                    </p>
                                                </SimpleBar>
                                            ) : (
                                                <div>
                                                    <p className="mb-4 text-gray-800">Director</p>
                                                    <p className="mb-4 text-gray-800">
                                                        After completing graduation Mr.
                                                        Mohammad Ashrafuzzaman joined family business of trading in
                                                        construction
                                                        materials like C. I. Sheet. M. S. Rod, Cement etc. In his
                                                        twenty-eight
                                                        years of trading business, he acquired much experience later on
                                                        and appeared as
                                                        an industrial entrepreneur.
                                                    </p>
                                                    <br/>
                                                    <p className="mb-4 text-gray-800">
                                                        At present he is holding the directorship
                                                        of GPH Ispat Limited, GPH Power Generation Limited, GPH Ship
                                                        Builders
                                                        Limited, GPH Engineers &amp; Development Limited,
                                                        Jahangir &amp; Others Limited
                                                        and National Cement Mills Limited. He is also a sponsor
                                                        shareholder of M. I.
                                                        Cement Factory Limited (Crown Cement). Currently, he is
                                                        shouldering the
                                                        responsibility as the Managing Director of Eco Ceramics
                                                        Industries Limited, an auto
                                                        ceramic bricks manufacturing unit. He is also running a trading
                                                        firm as its sole
                                                        proprietor.
                                                    </p>
                                                    <br/><br/>
                                                    <p className="mb-4 text-gray-800">
                                                        Moreover, he is engaged in different social
                                                        activities by associating himself with some national and
                                                        international
                                                        social benevolent organizations.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            modalType == "video" &&
                            <div className="video-modal">
                                <div
                                    className="cursor-pointer close-btn"
                                    onClick={() => setModalIsOpen(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="21.414"
                                        height="21.414"
                                        viewBox="0 0 21.414 21.414"
                                    >
                                        <g
                                            id="Group_13674"
                                            data-name="Group 13674"
                                            transform="translate(-1224.793 -42.793)"
                                        >
                                            <line
                                                id="Line_1"
                                                data-name="Line 1"
                                                x2="28.284"
                                                transform="translate(1225.5 43.5) rotate(45)"
                                                fill="none"
                                                stroke="#FFF"
                                                strokeLinecap="round"
                                                strokeWidth="1"
                                            />
                                            <line
                                                id="Line_2"
                                                data-name="Line 2"
                                                x2="28.284"
                                                transform="translate(1225.5 63.5) rotate(-45)"
                                                fill="none"
                                                stroke="#FFF"
                                                strokeLinecap="round"
                                                strokeWidth="1"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <VideoPlayerWrapper url="https://www.youtube.com/watch?v=D0UnqGm_miA"
                                                    controls={false}
                                                    playing={true}
                                                    muted={true} // <-- This is critical for autoplay!
                                                    config={{
                                                        youtube: {
                                                            playerVars: {
                                                                autoplay: 1,
                                                                mute: 1, // YouTube-specific, but muted={true} is what matters for browsers
                                                            }
                                                        }
                                                    }}
                                />
                            </div>
                        }
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <section className="relative">
            <div>
                <>
                    <Button
                        text={title}
                        background='var(--var-dc--primary-color)'
                        hoverBackground='var(--var-dc--secondary-color)'
                        color='#FFF'
                        hoverColor='#FFF'
                        fontSize={18}
                        borderRadius={8}
                        margin="30px 0 30px 0"
                        fontWeight={500}
                        border='1px solid var(--var-dc--primary-color)'
                        onClick={() => modalType === "team" ? handleModalToggle(true) : setModalIsOpen(true)}
                    /></>

                {portalRoot && createPortal(<ModalContent/>, portalRoot)}
            </div>
        </section>
    );
};

export default MyComponent;