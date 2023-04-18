import {useRef, useEffect} from 'react'

import {disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock' // https://github.com/willmcpo/body-scroll-lock

/**
 * Hook to enable scrolling on provided ref
 * @prop {boolean} [global = false] - Boolean handling whether to clearAllBodyScrollLocks if true or enableBodyScroll if false
 * @returns {ref} - Ref to be attached to scrollable element
 */

const useScroll = (global = false) => {

	const scrollRef = useRef(null)

	//Disabling scrolling if global is true and enabling scrolling on passed ref if global is false
	useEffect(() => {
		const scrollRefPointer = scrollRef.current
		disableBodyScroll(scrollRefPointer)
		return () => {
			if(global) {
				clearAllBodyScrollLocks()
			}
			else{
				enableBodyScroll(scrollRefPointer)
			}
		}
	}, [global])

	return scrollRef

}

export default useScroll