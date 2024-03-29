import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import store from '../../store';

import { filtersChanged,fetchFilters, selectAll } from "./filtersSlice";
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {

    const {filterLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const filters = selectAll(store.getState())
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilters())
    }, [])

    if (filterLoadingStatus === 'loading') {
        return <Spinner/>
    } else if (filterLoadingStatus === 'error') {
        return <h5 className="text-center mt-5">Loading error</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Filters not found</h5>
        } 

        return arr.map(({name, className, label}) => {
            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            })

            return <button 
                        key={name}
                        id={name}
                        className={btnClass}
                        onClick={() => dispatch(filtersChanged(name))}
                        >{label}
                    </button>
        })
    }

    const elements = renderFilters(filters)

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Filter heroes by elements</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;