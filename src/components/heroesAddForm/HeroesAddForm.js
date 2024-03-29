import { useHttp } from "../../hooks/http.hook";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import store from "../../store";

import { heroCreated } from "../heroesList/heroesSlice";
import { selectAll } from "../heroesFilters/filtersSlice";
 
const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const {filterLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState())
    const dispatch = useDispatch();
    const { request } = useHttp();

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const newHero = {
            id: nanoid(),
            name: heroName,
            description: heroDescr,
            element: heroElement
        }

        request('http://localhost:3001/heroes', 'POST', JSON.stringify(newHero))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err))

            setHeroName('');
            setHeroDescr('');
            setHeroElement('');
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Loadnig elements...</option>
        } else if (status === 'error') {
            return <option>Loading error</option>
        }

        if (filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                if (name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Name of the new hero</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="What is my name?"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Description</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="What I can do?"
                    style={{"height": '130px'}}
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Choose element of hero</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={(e) => setHeroElement(e.target.value)}>
                    <option value={null} >I own the element...</option>
                    {renderFilters(filters, filterLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}

export default HeroesAddForm;