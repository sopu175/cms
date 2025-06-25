'use client'

import React from 'react'
import { VideoPlayer } from '../global/VideoPlayer'

/**
 * VideoPlayerWrapper Component
 * 
 * A client-side wrapper for the VideoPlayer component that adds progress tracking and
 * maintains a consistent layout. This component inherits all props from VideoPlayer
 * and can be used as a drop-in replacement with additional features.
 * 
 * Key Features:
 * - Automatic platform detection (YouTube, Vimeo, Facebook, etc.)
 * - Progress tracking with console logging
 * - Consistent layout with padding and max-width
 * - Inherits all VideoPlayer props and functionality
 * 
 * @example
 * // Basic usage
 * <VideoPlayerWrapper url="https://www.youtube.com/watch?v=VIDEO_ID" controls />
 * 
 * @example
 * // Autoplay configuration (requires muted)
 * <VideoPlayerWrapper
 *   url="https://vimeo.com/VIDEO_ID"
 *   playing={true}
 *   muted={true}
 *   controls={true}
 * />
 * 
 * @example
 * // YouTube with specific configuration
 * <VideoPlayerWrapper
 *   url="https://www.youtube.com/watch?v=VIDEO_ID"
 *   playing={false}
 *   muted={false}
 *   controls={true}
 *   config={{
 *     youtube: {
 *       playerVars: {
 *         modestbranding: 1,
 *         showinfo: 0,
 *         rel: 0
 *       }
 *     }
 *   }}
 * />
 * 
 * @example
 * // Facebook video (requires appId)
 * <VideoPlayerWrapper
 *   url="https://www.facebook.com/facebook/videos/VIDEO_ID"
 *   config={{
 *     facebook: {
 *       appId: 'YOUR_FACEBOOK_APP_ID'
 *     }
 *   }}
 * />
 */

// Import all props type from VideoPlayer
type VideoPlayerProps = React.ComponentProps<typeof VideoPlayer>

/**
 * VideoPlayerWrapper Component
 * 
 * @param {VideoPlayerProps} props - All props from VideoPlayer component
 * @returns {JSX.Element} A wrapped video player with progress tracking
 */
export const VideoPlayerWrapper: React.FC<VideoPlayerProps> = (props) => {
    /**
     * Handles video progress updates
     * @param {Object} state - The progress state object
     * @param {number} state.played - Percentage of video played (0 to 1)
     * @param {number} state.playedSeconds - Seconds of video played
     * @param {number} state.loaded - Percentage of video loaded (0 to 1)
     * @param {number} state.loadedSeconds - Seconds of video loaded
     */
    const handleProgress = (state: { 
        played: number; 
        playedSeconds: number; 
        loaded: number; 
        loadedSeconds: number 
    }) => {
        console.log('Progress:', state.played)
        props.onProgress?.(state)
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <VideoPlayer 
                {...props}
                onProgress={handleProgress}
            />
        </div>
    )
}

// Example usage with different video types
export const VideoExamples = () => {
    return (
        <div className="space-y-8">
            {/* YouTube Example */}
            <div>
                <h3 className="text-lg font-semibold mb-4">YouTube Video</h3>
                <VideoPlayerWrapper 
                    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    playing={false}
                    muted={false}
                    controls={true}
                    config={{
                        youtube: {
                            playerVars: {
                                modestbranding: 1,
                                showinfo: 0,
                                rel: 0,
                                autoplay: 0,
                                controls: 1,
                                enablejsapi: 1,
                                iv_load_policy: 3,
                            }
                        }
                    }}
                    fallback={<div>Sorry, this video cannot be played.</div>}
                />
            </div>

            {/* Vimeo Example */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Vimeo Video</h3>
                <VideoPlayerWrapper 
                    url="https://vimeo.com/225519343"
                    playing={false}
                    muted={true}
                    playbackRate={1.5}
                    volume={0.7}
                    pip={true}
                    config={{
                        vimeo: {
                            playerOptions: {
                                quality: "1080p"
                            }
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default VideoPlayerWrapper 