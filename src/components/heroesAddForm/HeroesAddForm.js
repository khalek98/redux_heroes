import { useState } from "react";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import store from "../../store";

import { selectAll } from "../heroesFilters/filtersSlice";
import { useCreateHeroMutation } from "../api/apiSlice";
 
const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const [createHero, {isLoading}] = useCreateHeroMutation();

    const {filterLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState())

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const newHero = {
            id: nanoid(),
            name: heroName,
            description: heroDescr,
            element: heroElement
        }

        createHero(newHero).unwrap();

        setHeroName('');
        setHeroDescr('');
        setHeroElement('');
    }

    const renderFilters = (filters, status) => {
        if (isLoading) {
            return <option>Loadnig elements...</option>
        } else if (status === 'error') {
            return <option>Loading error</option>
        }

        if (filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                if (name === 'all') return null;

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