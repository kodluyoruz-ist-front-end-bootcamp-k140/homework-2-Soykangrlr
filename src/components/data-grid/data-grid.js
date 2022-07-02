import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { FormItem } from "../form-item";
import Pagination from "../pagination/pagination";
import Search from "../search/search";

export function DataGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = useState(null);
  const [page, setPage] = useState(30);
  const [sliceItem, setSliceItem] = useState([]);
  const [pageNo1, setPageNo1] = useState(0);
  const [pageNo2, setPageNo2] = useState(page);
  const [sortArray, setsortArray] = useState([]);
  const [sortString, setSortString] = useState("asc");
  const [filterText, setFilter] = useState("");
  const [searchItem, setSearchItem] = useState([]);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((x) => x.json())
      .then((response) => {
        setItems(response);
        setSliceItem(response.slice(0, page));
        setsortArray(response.slice(0, page));
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const renderBody = () => {
    return (
      <React.Fragment>
        {sliceItem.map((item, i) => {
          return (
            <tr key={i}>
              <th scope="row">{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
              <td>
                <Button
                  className="btn btn-xs btn-danger"
                  onClick={() => onRemove(item.id)}
                >
                  Sil
                </Button>
                <Button
                  className="btn btn-xs btn-warning"
                  onClick={() => onEdit(item)}
                >
                  Düzenle
                </Button>
              </td>
            </tr>
          );
        })}
      </React.Fragment>
    );
  };

  const renderTable = () => {
    return (
      <>
        <div className="tableHeader">
          <Button onClick={onAdd}>Ekle</Button>
          <Search
            onClick={() => {
              setSearchItem(sliceItem);
            }}
            onChange={(e) => {
              setFilter(e.target.value);
             
            }}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                id{" "}
                <Button
                  onClick={() => {
                    setsortArray(sliceItem);
                    setSortString(sortString == "asc" ? "desc" : "asc");
                    sortTableNumber();
                  }}
                  className={"btn btn-link btn-xs"}
                >
                  {"↑↓"}
                </Button>
              </th>
              <th scope="col">
                Başlık{" "}
                <Button
                  onClick={() => {
                    setsortArray(sliceItem);
                    setSortString(sortString == "asc" ? "desc" : "asc");
                    sortTableStringTitle();
                  }}
                  className={"btn btn-link btn-xs"}
                >
                  {"↑↓"}
                </Button>
              </th>
              <th scope="col">
                Durum{" "}
                <Button
                  onClick={() => {
                    setsortArray(sliceItem);
                    setSortString(sortString == "asc" ? "desc" : "asc");
                    sortTableStringCompleted();
                  }}
                  className={"btn btn-link btn-xs"}
                >
                  {"↑↓"}
                </Button>
              </th>
              <th scope="col">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>

        <Pagination
          onChange={(e) => {
            const pages = Number(e.target.value);
            setPage(pages);
          }}
          onClick={(e) => {
            pageNavigation(e);
          }}
          page1={pageNo1+1}
          page2={pageNo2}
        />
      </>
    );
  };
  //Arama
  useEffect(() => {
    handleSearch();
    if (filterText === "") {
      setSliceItem(searchItem);
    }
  }, [filterText]);
  const handleSearch = () => {
    let filtered = items.filter((item) => {
      return Object.keys(item).some((key) =>
        item[key].toString().toLowerCase().includes(filterText.toLowerCase())
      );
    });
    setSliceItem(filtered);
  };
  // sayfalama yapıldı
  useEffect(() => {
    pageChangeTable();
  }, [page]);

  useEffect(() => {
    handleNavigation();
  }, [pageNo1, pageNo2]);

  const pageChangeTable = () => {
    setSliceItem(items.slice(0, page));
    setPageNo1(0);
    setPageNo2(page);
  };
  // sayfa navigation
  const pageNavigation = (e) => {
    let val = items.length;
    if (val % page > 0) {
      val = (val % page) + val;
    }
    if (e.target.name === "up") {
      setPageNo1(
        pageNo2 + page > val
          ? () => {
              return pageNo1;
            }
          : pageNo1 + page
      );
      setPageNo2(
        pageNo2 + page > val
          ? () => {
              alert("sayfa sonu");
              return pageNo2;
            }
          : pageNo2 + page
      );
    } else {
      setPageNo1(
        pageNo1 - page < 0
          ? () => {
              return pageNo1;
            }
          : pageNo1 - page
      );
      setPageNo2(
        pageNo1 - page < 0
          ? () => {
              alert("sayfa Başı");
              return pageNo2;
            }
          : pageNo2 - page
      );
    }
  };
  const handleNavigation = () => {
    setSliceItem(items.slice(pageNo1, pageNo2));
  };

  // Sıralama kodları
  useEffect(() => {
    setsortArray(sliceItem);
  }, [sliceItem]);
  const sortTableNumber = () => {
    if (sortString === "asc") {
      console.log(sortArray[0].id + sortArray[0]);
      setSliceItem(sortArray.sort((a, b) => b.id - a.id));
    } else {
      setSliceItem(sortArray.sort((a, b) => a.id - b.id));
    }
  };
  const sortTableStringTitle = () => {
    if (sortString === "asc") {
      setSliceItem(
        sortArray.sort((a, b) => {
          a = a.title || "";
          b = b.title || "";
          return a.localeCompare(b);
        })
      );
    } else {
      setSliceItem(
        sortArray.sort((a, b) => {
          a = a.title || "";
          b = b.title || "";
          return b.localeCompare(a);
        })
      );
    }
  };
  const sortTableStringCompleted = () => {
    console.log(sortArray[0].completed.toString());
    if (sortString === "asc") {
      setSliceItem(
        sortArray.sort((a, b) => {
          a = a.completed.toString() || "";
          b = b.completed.toString() || "";
          return a.localeCompare(b);
        })
      );
    } else {
      setSliceItem(
        sortArray.sort((a, b) => {
          a = a.completed.toString() || "";
          b = b.completed.toString() || "";
          return b.localeCompare(a);
        })
      );
    }
  };

  const saveChanges = () => {
    // insert
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map((item) => item.id)) + 1;
      setItems((items) => {
        items.push(todo);
        return [...items];
      });

      alert("Ekleme işlemi başarıyla gerçekleşti.");
      setTodo(null);
      return;
    }
    // update
    const index = items.findIndex((item) => item.id == todo.id);
    setItems((items) => {
      items[index] = todo;
      return [...items];
    });
    setSliceItem((items) => {
      items[index] = todo;
      return [...items];
    });
    setTodo(null);
  };

  const onAdd = () => {
    setTodo({
      id: -1,
      title: "",
      completed: false,
    });
  };

  const onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?");

    if (!status) {
      return;
    }
    const index = items.findIndex((item) => item.id == id);

    setItems((items) => {
      items.splice(index, 1);
      return [...items];
    });
    setSliceItem((items) => {
      items.splice(index, 1);
      return [...items];
    });
  };

  const onEdit = (todo) => {
    setTodo(todo);
  };

  const cancel = () => {
    setTodo(null);
  };

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, title: e.target.value };
            })
          }
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, completed: e.target.checked };
            })
          }
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>
          Vazgeç
        </Button>
      </>
    );
  };

  return (
    <>{loading ? "Yükleniyor...." : todo ? renderEditForm() : renderTable()}</>
  );
}
