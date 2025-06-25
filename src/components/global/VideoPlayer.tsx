'use client'

import React, { useState, useCallback } from 'react'
import ReactPlayer from 'react-player'

/**
 * VideoPlayer Props Interface
 * @interface VideoPlayerProps
 * 
 * @property {string} url - The URL of the video to play. Supports multiple formats:
 *   - YouTube: Normal URL (https://www.youtube.com/watch?v=VIDEO_ID)
 *   - YouTube: Embed URL (https://www.youtube.com/embed/VIDEO_ID)
 *   - YouTube: Shortened (https://youtu.be/VIDEO_ID)
 *   - Vimeo: (https://vimeo.com/VIDEO_ID)
 *   - Facebook: (https://www.facebook.com/facebook/videos/VIDEO_ID)
 *   - Direct file URLs (MP4, WebM, OGG)
 * 
 * @property {string} [className] - Additional CSS classes for the video container
 * @property {boolean} [controls=true] - Show/hide player controls
 * @property {boolean|string} [light=false] - Enable/disable light mode, or provide thumbnail URL
 * @property {boolean} [playing=false] - Auto-play video. Note: Requires muted=true in most browsers
 * @property {boolean} [loop=false] - Loop the video
 * @property {boolean} [muted=false] - Mute the video. Required for autoplay in most browsers
 * @property {string} [width='100%'] - Video player width
 * @property {string} [height='100%'] - Video player height
 * @property {number} [playbackRate=1] - Playback speed rate (0.5 to 2)
 * @property {number} [volume=0.8] - Player volume (0 to 1)
 * @property {boolean} [pip=false] - Enable/disable picture-in-picture mode
 * @property {boolean} [stopOnUnmount=true] - Stop video when component unmounts
 * @property {React.ReactNode} [fallback] - Fallback content when video fails to load
 * @property {'auto'|'metadata'|'none'} [preload='auto'] - Video preload attribute
 * @property {boolean} [playsinline=true] - Play video inline on mobile devices
 * 
 * @property {Object} [config] - Platform-specific configurations
 * @property {Object} [config.youtube] - YouTube-specific config
 * @property {Object} [config.youtube.playerVars] - YouTube player parameters
 * @property {Object} [config.vimeo] - Vimeo-specific config
 * @property {Object} [config.vimeo.playerOptions] - Vimeo player options
 * @property {Object} [config.facebook] - Facebook-specific config
 * @property {string} [config.facebook.appId] - Facebook App ID (required for FB videos)
 * 
 * @property {Function} [onReady] - Callback when player is ready
 * @property {Function} [onStart] - Callback when video starts playing
 * @property {Function} [onPlay] - Callback when video plays
 * @property {Function} [onPause] - Callback when video is paused
 * @property {Function} [onBuffer] - Callback when video starts buffering
 * @property {Function} [onBufferEnd] - Callback when buffering ends
 * @property {Function} [onError] - Callback when an error occurs
 * @property {Function} [onEnded] - Callback when video ends
 * @property {Function} [onProgress] - Callback for playback progress
 * @property {Function} [onDuration] - Callback with video duration
 * @property {Function} [onSeek] - Callback when seeking video
 * @property {Function} [onPlaybackRateChange] - Callback when playback rate changes
 * @property {Function} [onClickPreview] - Callback when clicking preview/thumbnail
 */

type VideoPlayerProps = {
    url: string
    className?: string
    controls?: boolean
    light?: boolean | string
    playing?: boolean
    loop?: boolean
    muted?: boolean
    width?: string
    height?: string
    playbackRate?: number
    volume?: number
    pip?: boolean
    stopOnUnmount?: boolean
    fallback?: React.ReactNode
    playsinline?: boolean
    config?: {
        youtube?: {
            playerVars?: {
                [key: string]: unknown
            }
        }
        facebook?: {
            appId?: string
        }
        vimeo?: {
            playerOptions?: {
                [key: string]: unknown
            }
        }
    }
    onReady?: () => void
    onStart?: () => void
    onPlay?: () => void
    onPause?: () => void
    onBuffer?: () => void
    onBufferEnd?: () => void
    onError?: (error: unknown) => void
    onEnded?: () => void
    onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void
    onDuration?: (duration: number) => void
    onSeek?: (seconds: number) => void
    onPlaybackRateChange?: (speed: number) => void
    onClickPreview?: () => void
}

/**
 * VideoPlayer Component
 * 
 * A flexible video player component that supports multiple platforms including YouTube, Vimeo, Facebook,
 * and direct video files. It provides a consistent interface across different video platforms and handles
 * platform-specific configurations automatically.
 * 
 * @example
 * // Basic usage with YouTube
 * <VideoPlayer url="https://www.youtube.com/watch?v=VIDEO_ID" controls />
 * 
 * @example
 * // Autoplay (requires muted)
 * <VideoPlayer
 *   url="https://vimeo.com/VIDEO_ID"
 *   playing={true}
 *   muted={true}
 *   controls={true}
 * />
 * 
 * @example
 * // With platform-specific config
 * <VideoPlayer
 *   url="https://www.youtube.com/watch?v=VIDEO_ID"
 *   config={{
 *     youtube: {
 *       playerVars: {
 *         modestbranding: 1,
 *         showinfo: 0
 *       }
 *     }
 *   }}
 * />
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    url,
    className = '',
    controls = true,
    light = false,
    playing = false,
    loop = false,
    muted = false,
    width = '100%',
    height = '100%',
    playbackRate = 1,
    volume = 0.8,
    pip = false,
    stopOnUnmount = true,
    fallback = null,
    playsinline = true,
    config = {},
    onReady,
    onStart,
    onPlay,
    onPause,
    onBuffer,
    onBufferEnd,
    onError,
    onEnded,
    onProgress,
    onDuration,
    onSeek,
    onPlaybackRateChange,
    onClickPreview,
}) => {
    const [isError, setIsError] = useState(false)
    const [isBuffering, setIsBuffering] = useState(false)

    const handleError = useCallback((error: unknown) => {
        setIsError(true)
        if (onError) onError(error)
    }, [onError])

    const handleBuffer = useCallback(() => {
        setIsBuffering(true)
        if (onBuffer) onBuffer()
    }, [onBuffer])

    const handleBufferEnd = useCallback(() => {
        setIsBuffering(false)
        if (onBufferEnd) onBufferEnd()
    }, [onBufferEnd])

    if (isError && fallback) {
        return <>{fallback}</>
    }

    return (
        <div className={`relative aspect-video rounded-2xl overflow-hidden shadow-md ${className}`}>
            {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
            <ReactPlayer
                url={url}
                controls={controls}
                light={light}
                playing={playing}
                loop={loop}
                muted={muted}
                width={width}
                height={height}
                playbackRate={playbackRate}
                volume={volume}
                pip={pip}
                stopOnUnmount={stopOnUnmount}
                playsinline={playsinline}
                config={{
                    youtube: {
                        playerVars: {
                            modestbranding: 1,
                            ...config.youtube?.playerVars,
                        },
                    },
                    vimeo: {
                        playerOptions: {
                            autopause: false,
                            ...config.vimeo?.playerOptions,
                        },
                    },
                    ...config,
                }}
                className="absolute top-0 left-0"
                onReady={onReady}
                onStart={onStart}
                onPlay={onPlay}
                onPause={onPause}
                onBuffer={handleBuffer}
                onBufferEnd={handleBufferEnd}
                onError={handleError}
                onEnded={onEnded}
                onProgress={onProgress}
                onDuration={onDuration}
                onSeek={onSeek}
                onPlaybackRateChange={onPlaybackRateChange}
                onClickPreview={onClickPreview}
            />
        </div>
    )
}
