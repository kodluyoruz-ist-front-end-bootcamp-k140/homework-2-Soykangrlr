import { Button } from "../button";
import './pagination.css'
function Pagination({onClick,onChange,page1,page2}) {
  return (
    <div className="pagination">
        <p>Sayfa aralığı {page1} - {page2}</p>
        <Button name="down" onClick={onClick} className="btn btn-sm btn-info m-2">{"<"}</Button>
        <select onChange={onChange} >
            <option value={10} key="1" >10</option>
            <option value={20} key="2">20</option>
            <option value={30} key="3" selected>30</option>
            <option value={40} key="4">40</option>
            <option value={50} key="5">50</option>
        </select>
        <Button name="up" onClick={onClick} className="btn btn-sm btn-info m-2">{">"}</Button>

    </div>
  )
}
export default Pagination