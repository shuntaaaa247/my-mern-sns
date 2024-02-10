import "./Rightbar.css"

export default function Rightbar() {
  return(
    <div className="Rightbar">
      {/* Trands totrack */}
      <div className="w-[90%] bg-stone-100 rounded-3xl ml-auto mr-auto mt-[5%]">
        <p className="text-3xl font-semibold pt-4 pl-5">Trends to tranck</p>
        <ul className="ml-[8%] pb-5">
          <li className="my-2">
            <span className="text-sm text-stone-600">1・Trend</span>
            <br />
            <span className="text-lg">TypeScript</span>
          </li>
          <li className="my-2">
            <span className="text-sm text-stone-600">2・Trend</span>
            <br />
            <span className="text-lg">Python</span>
          </li>
          <li className="my-2">
            <span className="text-sm text-stone-600">3・Trend</span>
            <br />
            <span className="text-lg">Full Stack</span>
          </li>
          <li className="my-2">
            <span className="text-sm text-stone-600">4・Trend</span>
            <br />
            <span className="text-lg">Node.js</span>
          </li>
          <li className="my-2">
            <span className="text-sm text-stone-600">5・Trend</span>
            <br />
            <span className="text-lg">T3 Stack</span>
          </li>
        </ul>
      </div>

      {/* Who to follow */}
      <div className="">
        <ul>
          <li>
            山田太郎
          </li>
          <li>
            山田太郎
          </li>
          <li>
            山田太郎
          </li>
        </ul>
      </div>
    </div>
  )
}