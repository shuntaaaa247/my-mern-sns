import React, { useRef } from "react";
import "./Search.css";
import SearchIcon from '@mui/icons-material/Search';
import { SearchResult } from "../searchResult/SearchResult";
import { useNavigate } from "react-router-dom";

export const Search = () => {
  const searchText = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const trendList: string[] = [
    "TypeScript", "Python", "Full Stack", "Node.js", "T3 Stack", 
    "React.js", "Vue.js",  "Angular.js", "Rust", "AWS",
    "GCP", "C#", "Swift", "MySQL", "Firebase", 
    "Ruby", "PHP", "Flutter", "Django", "Next.js",
    "Kotlin", "PostgresQL", "R", "SwiftUI", "Scala",
    "Solidity", "Dart", "Perl", "C++", "PHP",
  ]
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if(searchText.current?.value !== "" && searchText.current?.value !== null) {
      e.preventDefault();
      navigate(`/search?text=${searchText.current?.value}`);
    }
  }

  return(
    <div className="Search">
      <form className="SearchbarArea" onSubmit={(e) => handleSearch(e)}>
        <label htmlFor="SearchInput" className="SearchLabel"><SearchIcon className="SearchIcon"/></label>
        <input ref={searchText} type="text" placeholder="Search" id="SearchInput" className="SearchInput bg-[#f5f5f5] focus:ring-0"/>
      </form>
      {window.location.href.includes("search?text=") && window.location.href.split("search?text=")[1] !== ""
        ? <SearchResult />
        : 
          <div className="TrendArea">
            <ul>
              {trendList.map((trend, index) => (
                <li key={index} className="mt-2 mb-3">
                  <span className="text-sm text-stone-600">{index + 1}・Trending</span>
                  <br />
                  <span className="text-lg">{trend}</span>
                </li>
              ))}
            </ul>
          </div>
      } 
      
    </div>
  )
}
