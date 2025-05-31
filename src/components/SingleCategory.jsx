import { useParams } from "react-router-dom"
import Header from './Header'

const SingleCategory = () => {

    const {category} = useParams()
    

  return (
    <>
    <Header/>
     <div>
        <p className="w-max mx-auto mt-[15vh] text-[3rem] sm:text-[6rem] 2xl:text-[10rem] font-bold">
            {category.charAt(0).toUpperCase() + category.slice(1)}
        </p>
    </div>
    </>
  )
}

export default SingleCategory