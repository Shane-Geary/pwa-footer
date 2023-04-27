import {useState, useEffect, useRef} from 'react' //React hooks

import {makeStyles} from 'tss-react/mui' // https://docs.tss-react.dev/
import {GlobalStyles} from 'tss-react'// https://docs.tss-react.dev/
// import useScroll from './Hooks/useScroll'

function ViewportConcept() {

	console.log('hello')

	const elementRef = useRef(null)

	//State for keeping the viewports height and width
	const [vvHeight, setVVHeight] = useState(window.visualViewport.height)
	const [vvWidth, setVVWidth] = useState(window.visualViewport.width)

	// const [vInnerHeight, setVInnerHeight] = useState(window.innerHeight)
	// const [vInnerWidth, setVInnerWidth] = useState(window.innerWidth)

	const [vOuterHeight, setVOuterHeight] = useState(window.outerHeight)
	const [vOuterWidth, setVOuterWidth] = useState(window.outerWidth)

	const [vHeightDifference, setVHeightDifference] = useState(window.outerHeight - window.innerHeight)
	const [vWidthDifference, setVWidthDifference] = useState(window.outerWidth - window.innerWidth)

	// const pageRef = useScroll()
	const pageRef = useRef(null)
	const runwayWrapperRef = useRef(null)
	const footerRef = useRef(null)
	const appendageChildRef = useRef(null)

	//Instantiating TSS classes and passing props
	const {classes} = useStyles(
		{vvHeight, vvWidth}
	)
	

	// useEffect hook for resize event listener and displaying viewport sizes 
	useEffect(() => {
		const updateVV = (event) => {
			// console.log(event)

			setTimeout(() => {
				// setVInnerHeight(window.innerHeight)
				// setVInnerWidth(window.innerWidth)

				// setVVHeight(event.target.height)
				// setVVWidth(event.target.width)

				setVOuterHeight(window.outerHeight)
				setVOuterWidth(window.outerWidth)

				setVHeightDifference(window.outerHeight - window.visualViewport.height)
				setVWidthDifference(window.outerWidth - window.visualViewport.width)
			}, 100)
		}

		const resizeEvent = window.visualViewport.addEventListener('resize', updateVV)

		return () => {
			window.visualViewport.removeEventListener(resizeEvent)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const footer = footerRef.current
		const handleTouchMove = (e) => {
			e.preventDefault()
		}

		footer.addEventListener('touchmove', handleTouchMove, {passive: false})

		window.addEventListener('virtualkeyboardchange', (e) => {
			console.log(e)
		})

		return () => {
			footer.removeEventListener('touchmove', handleTouchMove)
		}
	}, [])

	// commented this out Adams v1
	useEffect(() => {
		const endOfScrollBumper = window.screen.availHeight * 2
		console.log(endOfScrollBumper)

		const runwayWrapper = runwayWrapperRef.current
		const handleTouchMove = (e) => {
			if(runwayWrapperRef.current.scrollTop === 0) {
				runwayWrapperRef.current.scrollTo(0, 1)
			}
			if(elementRef.current && isElementInView(elementRef.current)) {
				e.preventDefault()
				runwayWrapperRef.current.scrollTo({
					// 1560 for Android - 1624 for Iphone X
					top: runwayWrapperRef.current.scrollHeight - endOfScrollBumper,
					behavior: 'smooth'
				})
			}
		}
	
		function isElementInView(element) {
			const { top, bottom } = element.getBoundingClientRect()
			console.log(top >= 0 && bottom <= window.innerHeight)
			return top >= 0 && bottom <= window.innerHeight
		}
		
		window.addEventListener("touchmove", handleTouchMove, {passive: false})
		runwayWrapper.addEventListener('scroll', handleTouchMove, {passive: false})

		return () => {
			window.removeEventListener("touchmove", handleTouchMove)
			runwayWrapper.addEventListener('scroll', handleTouchMove)
		}
	}, [])

	// useEffect(() => {
	// 	const preventScroll = (e) => {
	// 		if(e.touches && e.touches.length > 0) {
	// 			const deltaY = e.touches[0].clientY - startY
	// 			if(Math.abs(deltaY) > 10) {
	// 				// e.preventDefault()
	// 				runwayWrapperRef.current.scrollTo(0, 1)
	// 			}
	// 		}
	// 	}
	
	// 	let startY = 0
	// 	const handleTouchStart = (e) => {
	// 		startY = e.touches[0].clientY
	// 	}
	
	// 	runwayWrapperRef.current.addEventListener("touchstart", handleTouchStart)
	// 	runwayWrapperRef.current.addEventListener("touchmove", preventScroll, {passive: false})
	
	// 	return () => {
	// 		runwayWrapperRef.current.removeEventListener("touchstart", handleTouchStart)
	// 		runwayWrapperRef.current.removeEventListener("touchmove", preventScroll)
	// 	}
	// })

	return (
		//Keeping the height of the container div to be the height of the visualViewport
		<div
			ref={pageRef}
			className={classes.page}
		>
			<GlobalStyles 
				styles={{
					'body': {
						margin: 0,
						padding: 0,
						// overflow: 'hidden'
					}
				}}
			/>
			<div className={classes.masterDiv}>
				<div
					ref={runwayWrapperRef}
					className={classes.runwayWrapper}
				>
					<div className={classes.viewportSizes}>
						Height px Ext/VVP/VH - {vHeightDifference}/{vvHeight}/{vOuterHeight}
						<div>Width px Ext/VVP/VH - {vWidthDifference}/{vvWidth}/{vOuterWidth}</div>
					</div>

					<textarea
						type='text'
						tabIndex='1'
						className={classes.input}
						onClick={() => {
							console.log('click event - class appended')
							footerRef.current.classList.add(classes.footerDivAppend)
						}}
						onTouchStart={(e) => {
							e.target.focus({preventScroll: true})
							console.log('touch event - class appended')
							footerRef.current.classList.add(classes.footerDivAppend)
						}}
						onFocus={() => {
							console.log('scrolled past top')
							runwayWrapperRef.current.scrollTo(0, 1)
						}}
						onTouchEnd={(e) => {
							console.log('touch end')
							e.target.focus({preventScroll: true})
						}}
						onBlur={() => {
							footerRef.current.classList.remove(classes.footerDivAppend)
						}}
					/>
					
					<div className={classes.runwayTop}>

					</div>
					{/* <textarea
						type='text'
						tabIndex='1'
						className={classes.input}
						onClick={(e) => {
							runwayWrapperRef.current.scrollTo(0, 200)
							footerRef.current.classList.add(classes.footerDivAppend)
						}}
						onTouchStart={(e) => {
							e.target.focus({preventScroll: true})
							footerRef.current.classList.add(classes.footerDivAppend)
						}}
						onTouchEnd={(e) => {
							e.target.focus({preventScroll: true})
						}}
						onBlur={() => {
							footerRef.current.classList.remove(classes.footerDivAppend)
						}}
					/> */}
					<div className={classes.runway}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac bibendum purus. Fusce laoreet risus non erat aliquam, vitae pellentesque odio dignissim. Suspendisse laoreet porttitor finibus. Sed dignissim volutpat lacus, nec gravida est porta in. Nunc mollis, nisi eu efficitur imperdiet, lorem magna mattis turpis, vel tempus nisi lacus vel augue. Suspendisse dui nisi, aliquet ac lacus facilisis, feugiat mollis dolor. Aenean tincidunt aliquam erat, vestibulum porta mauris auctor sed. Sed varius lobortis urna in cursus. Nulla facilisi. Morbi bibendum sagittis lacus.

Pellentesque ornare leo at fringilla lacinia. Mauris tincidunt gravida neque et semper. Morbi id luctus arcu, vel dignissim mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta magna vel vulputate scelerisque. Maecenas gravida mattis vestibulum. Nulla in dignissim eros, in placerat velit. Pellentesque et justo et sapien lacinia maximus vel eu tellus. Curabitur sed urna magna. Vestibulum non vulputate quam. Cras eget enim nisi. Aliquam convallis, dui ultricies hendrerit gravida, velit mauris eleifend tortor, et maximus nisi quam commodo libero. Praesent sodales, quam eget feugiat convallis, tortor leo auctor quam, a feugiat sem sem quis urna. Integer non odio euismod, venenatis lorem aliquam, varius orci.

Suspendisse volutpat vel mi vitae cursus. Proin placerat est ac euismod consequat. Ut hendrerit lorem sapien, sit amet pretium turpis elementum eu. Nulla convallis enim sed nulla dapibus condimentum. In libero augue, iaculis suscipit rutrum vel, dignissim sit amet nisi. Vestibulum pellentesque, ex et semper sodales, ipsum enim scelerisque diam, et congue lacus erat nec lectus. In interdum cursus nisl. Suspendisse mollis vel quam a rutrum. Phasellus pellentesque elementum erat, et gravida sapien laoreet in. Phasellus vulputate dui ac quam auctor, porttitor dictum mauris consectetur.

Donec non enim ligula. Aenean dapibus hendrerit metus ornare condimentum. In pulvinar, magna quis rhoncus aliquam, erat diam interdum tortor, ut blandit eros ante aliquam tellus. Vestibulum pellentesque est ut erat malesuada rhoncus. Praesent luctus nibh at sagittis vestibulum. In hac habitasse platea dictumst. Integer sed rhoncus neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dignissim fringilla enim sit amet posuere. Donec ut consequat lectus. Nam tempor sem consequat turpis lobortis dictum. Vestibulum laoreet mollis rutrum. Nam tellus mauris, consectetur nec urna quis, hendrerit aliquet leo. Quisque dignissim varius augue.

Nunc dui quam, egestas quis massa cursus, hendrerit condimentum ante. Phasellus suscipit vulputate lectus, nec pulvinar sem ultrices sit amet. Phasellus ut euismod tortor, et pulvinar diam. Morbi sed condimentum ante. Sed posuere ornare erat sit amet sagittis. Donec sed urna pellentesque, elementum urna sed, condimentum ligula. Nullam porttitor vel tellus eu suscipit. Integer a turpis ut augue vehicula scelerisque. Nam ac urna nulla. Vestibulum lacus magna, gravida dapibus lobortis eu, porta eu sem.
					</div>
					<div ref={elementRef} className={classes.apendage}>
						<div ref={appendageChildRef} className={classes.apendageChild}></div>
					</div>
				</div>
				
				<div
					ref={footerRef}
					className={classes.footerDiv}
					onClick={() => {
						console.log('footer clicked/touched')
					}}
				>
					<textarea
						type='text'
						tabIndex='1'
						className={classes.input}
						onClick={(e) => {
							e.target.focus({preventScroll: true})
							footerRef.current.classList.add(classes.footerDivAppend)
						}}
						onTouchStart={(e) => {
							// This needs attention
							e.target.focus({preventScroll: true})
							// this needs to be removed to prevent it from closing
							// footerRef.current.classList.add(classes.footerDivAppend)
						}}
						onTouchEnd={(e) => {
							e.target.focus({preventScroll: true})
						}}
						onBlur={(e) => {
							footerRef.current.classList.remove(classes.footerDivAppend)
						}}
					/>
				</div>
			</div>
		</div>
	)
}

const useStyles = makeStyles()((_, props) => ({
	masterDiv: {
		display: 'flex',
		position: 'relative',
		height: '100%',

	},

	input: {width: 40},

	page: {
		position: 'relative',
		height: '100dvh',
		width: '100dvw',
		overflow: 'hidden'
	},

	viewportSizes: {
		fontSize: 14,
		display: 'block',
		position: 'absolute',
		left: '35%',
	},

	// pageAppend: {
	// 	overflow: 'hidden',
	// 	// TODO: This is for Iphone X
	// 	// height: '410.65625px',
	// 	height: '355px',
	// 	transition: 'height .5s',
	// 	// TODO: Easing-curve: ease-in-out
	// 	transitionTimingFunction: 'cubic-bezier(.45, .6, .33, .99)'
	// },
	runwayWrapper: {
		position: 'absolute',
		// height: '4710px',
		height: '100%',
		width: '100%',
		overflowY: 'scroll',
		WebkitOverflowScrolling: 'touch',
		backgroundColor: '#ED2290',
		color: 'white'
	},

	runwayTop: {height: '300px'},

	runway: {
		width: '100%',
		height: '4000px',
		marginTop: 40
	},

	apendage: {
		position: 'relative',
		top: '100vh',
	},
	
	apendageChild: {
		display: 'flex',
		// height: '294px',
		height: '1px',
		width: '100%',
		background: 'blue',
		zIndex: '10'
	},

	footerDiv: {
		// TODO: Fixed was preventing footer from moving on scroll - Android
		// position: 'fixed',

		position: 'fixed',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '44px',
		width: '100%',
		bottom: '0',
		backgroundColor: 'pink',
		zIndex: 1
	},
	footerDivAppend: {
		// shanes Iphone
		// bottom: '224.34375px',
		// Adams Iphone
		// bottom: '279px',
		// Android
		// Android total content height: 4441
		bottom: '294px'
	},
}))

export default ViewportConcept