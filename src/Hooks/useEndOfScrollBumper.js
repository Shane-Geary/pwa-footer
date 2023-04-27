import {useEffect} from 'react'

export const useEndOfScrollBumper = () => {
    useEffect(() => {
        const endOfScrollBumper = window.screen.availHeight * 2
    }, [])
}