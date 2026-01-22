import FilterMenu from "./FilterMenu"
import SortByTime from "./SortByTime"

const NotificationFilterAndSort = ({ sort, setSort, filter, setFilter }) => {
    return (
        <div className='flex gap-3 mt-6'>
            <FilterMenu
                filter={filter}
                setFilter={setFilter}
                label='Type'
                options={[
                    { value: "all", label: "All" },
                    { value: "success", label: "Success" },
                    { value: "info", label: "Info" },
                    { value: "warning", label: "Warning" },
                    { value: "error", label: "Error" }
                ]}
            />
            <SortByTime
                sort={sort}
                setSort={setSort}
            />
        </div>
    )
}

export default NotificationFilterAndSort
