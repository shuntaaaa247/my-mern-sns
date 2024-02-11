import React, { ReactNode, useRef } from "react";
import "./Search.css";
import SearchIcon from '@mui/icons-material/Search';

export const Search = () => {
  const searchText = useRef<HTMLInputElement | null>(null);
  const trendList: string[] = [
    "TypeScript", "Python", "Full Stack", "Node.js", "T3 Stack", 
    "React.js", "Vue.js",  "Angular.js", "Rust", "AWS",
    "GCP", "C#", "Swift", "MySQL", "Firebase", 
    "Ruby", "PHP", "Flutter", "Django", "Next.js",
    "Kotlin", "PostgresQL", "R", "SwiftUI", "Scala",
    "Solidity", "Dart", "Perl", "C++", "PHP",
  ]
  const handleSearch = () => {
    alert("検索");
  }

  return(
    <div className="Search">
      <form className="SearchbarArea" onSubmit={() => handleSearch()}>
        <label htmlFor="SearchInput" className="SearchLabel"><SearchIcon className="SearchIcon"/></label>
        <input ref={searchText} type="text" placeholder="Search" id="SearchInput" className="SearchInput bg-[#f5f5f5] focus:ring-0"/>
      </form>
      <div className="TrendArea">
        <ul>
          {trendList.map((trend, index) => (
            <li key={index} className="mt-2 mb-3">
              <span className="text-sm text-stone-600">{index + 1}・Tranding</span>
              <br />
              <span className="text-lg">{trend}</span>
            </li>
          ))}
          {/* {(() => {
            for (let i = 0; i < trendList.length; i ++) {
              return <li>{trendList[i]}</li>
            }
          })} */}
        </ul>
      </div>
    </div>
  )
}
