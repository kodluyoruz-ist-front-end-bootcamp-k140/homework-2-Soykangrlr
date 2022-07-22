

function Search({onChange,onClick}) {
   
  return (
    <div >
    <input type="text" onChange={onChange} placeholder="Sayfada Arama Yap" onClick={onClick} />
    </div>
   
  )}

export default Search