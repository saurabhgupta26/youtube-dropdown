import React, { useEffect, useRef, useState } from 'react'
import Card from './Card';
import { FaSearch } from 'react-icons/fa'
import { MdClose } from "react-icons/md";

import './App.css'

export default function SearchBar() {
    const [userData, setUserData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);

    const fetchData = () => {
        const url = 'https://mocki.io/v1/a0f57a34-3afb-467e-94dd-b6fc5d2e28af';
        fetch(url).then(res => res.json()).then(resp => setUserData(resp));
    }
    useEffect(() => {
        fetchData();
        addKeyDownListeners();
        return () => {
            removeKeyDownListeners();
        };
    }, [])

    const addKeyDownListeners = () => {
        if (dropdownRef.current) {
            dropdownRef.current.addEventListener("keydown", handleKeyDown);
        }
    };

    const removeKeyDownListeners = () => {
        if (dropdownRef.current) {
            dropdownRef.current.removeEventListener("keydown", handleKeyDown);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlightedIndex((prevIndex) => {
                if (prevIndex === 0) {
                    return userData.length - 1;
                } else {
                    return prevIndex - 1;
                }
            });
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlightedIndex((prevIndex) => {
                if (prevIndex === userData.length - 1) {
                    return 0;
                } else {
                    return prevIndex + 1;
                }
            });
        } else if (event.key === "Enter") {
            event.preventDefault();
            const activeItem = dropdownRef.current.querySelector(".active");
            if (activeItem && highlightedIndex >= 0 && highlightedIndex < userData.length) {
                console.log(userData[highlightedIndex]);
            }
        }
    };

    const handleClearSearch = () => {
        setSearchText('');
        fetchData();
    }
    const handleSearch = (e) => {
        setSearchText(e.target.value);
        if (!e.target.value) {
            fetchData();
            return;
        }
        const filtered = userData.filter((user) => {
            const nameMatch = user.name.toLowerCase().includes(e.target.value.toLowerCase());
            const itemsMatch = user.items.some((item) =>
                item.toLowerCase().includes(e.target.value.toLowerCase())
            );
            const addressMatch = user.address.toLowerCase().includes(e.target.value.toLowerCase());
            const pincodeMatch = String(user.pincode).includes(e.target.value);
            const idMatch = user.id.includes(e.target.value);
            return nameMatch || itemsMatch || addressMatch || pincodeMatch || idMatch;
        });
        setUserData(filtered);
    }
    // const dropdown = document.getElementsByClassName('card-style');
    console.log(highlightedIndex, '<<<<')
    console.log(dropdownRef.current, '=>>>')
    return (
        <div className="search-container">
            <h4> Search bar</h4>
            <div className="input-wrapper">
                <div className="input-flex-wrapper">
                    <FaSearch id='search-icon' />
                    <input type="text" id="Name" value={searchText}
                        onChange={handleSearch}
                        placeholder='Search users by ID, Address, Name or Pincode'
                        name="searchText"
                        className='input-search'
                    />
                </div>
                <MdClose id='clear-icon' onClick={handleClearSearch} />
            </div>
            <div className="dropdown-list" ref={dropdownRef}>
                {
                    searchText
                    && <>
                        {userData && !!userData > 0 ? (
                            userData.map((user, index) => {
                                return <Card key={user.id} user={user} searchText={searchText} highlighted={index === highlightedIndex} />;
                            })
                        ) : (
                            <>
                                <span className='empty-user'>No User Found</span>
                            </>
                        )}
                    </>
                }

            </div>
        </div>
    )
}