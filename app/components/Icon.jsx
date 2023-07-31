import { barlow } from "@/public/fonts"
import { film } from "@/public/icons"

export function Icon () {
    return (
        <div className="icon-cont">
            {film}
            <h1 className={barlow.className}>JMDB</h1>
        </div>
    )
}