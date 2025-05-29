
const Banner = () => {
  return (
    <div>
      <p className=" w-max mx-auto mt-[10vh] text-[4rem] sm:text-[10rem] 2xl:text-[13rem] font-bold">
        EZ NEWS
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 sm:w-[80%] 2xl:w-[60%] mx-auto px-4">
        <div class="h-[20vh] sm:h-[32vh] 2xl:h-[50vh] sm:row-span-2 bg-blue-200">Div 1</div>
        <div class="h-[20vh] sm:h-[15vh] 2xl:h-[24vh] bg-green-200">Div 2</div>
        <div class="h-[20vh] sm:h-[15vh] 2xl:h-[24vh] bg-red-200">Div 3</div>
      </div>
    </div>
  )
}

export default Banner