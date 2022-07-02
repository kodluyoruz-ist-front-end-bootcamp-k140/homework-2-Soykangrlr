import React from "react";
import { Button } from "../button";
import { FormItem } from "../form-item";
import Pagination from "../pagination/pagination";
import Search from "../search/search";

export class DataGridClsComponent extends React.Component {
  state = {
    loading: false,
    items: [],
    todo: null,
    page: 30,
    sliceItem: [],
    pageNo1: 0,
    pageNo2:30,
    sortArray: [],
    sortString: [],
    filterText: "",
    searchItem: [],
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.setState({ loading: true });
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((x) => x.json())
      .then((response) => {
        this.setState({
          items: response,
          loading: false,
          sliceItem: response.slice(0, this.state.page),
          sortArray: response.slice(0, this.state.page),
        });
      })
      .catch((e) => {
        this.setState({ loading: false });
      });
  };

  renderBody = () => {
    return (
      <React.Fragment>
        {this.state.sliceItem.map((item, i) => {
          return (
            <tr key={i}>
              <th scope="row">{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
              <td>
                <Button
                  className="btn btn-xs btn-danger"
                  onClick={() => this.onRemove(item.id)}
                >
                  Sil
                </Button>
                <Button
                  className="btn btn-xs btn-warning"
                  onClick={() => this.onEdit(item)}
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

  renderTable = () => {
    return (
      <>
        <div className="tableHeader">
          <Button onClick={this.onAdd}>Ekle</Button>
          <Search
            onClick={() => {
              this.setState({ searchItem: this.state.sliceItem });
            }}
            onChange={(e) => {
              this.setState({ filterText: e.target.value });
              this.handleSearch();
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
                    this.setState({ sortArray: this.state.sliceItem });
                    this.setState({
                      sortString:
                        this.state.sortString == "asc" ? "desc" : "asc",
                    });
                    this.sortTableNumber();
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
                    this.setState({ sortArray: this.state.sliceItem });
                    this.setState({
                      sortString:
                        this.state.sortString == "asc" ? "desc" : "asc",
                    });
                    this.sortTableStringTitle();
                  }}
                  className={"btn btn-link btn-xs"}
                >
                  {"↑↓"}
                </Button>{" "}
              </th>
              <th scope="col">
                Durum{" "}
                <Button
                  onClick={() => {
                    this.setState({ sortArray: this.state.sliceItem });
                    this.setState({
                      sortString:
                        this.state.sortString == "asc" ? "desc" : "asc",
                    });
                    this.sortTableStringCompleted();
                  }}
                  className={"btn btn-link btn-xs"}
                >
                  {"↑↓"}
                </Button>{" "}
              </th>
              <th scope="col">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>{this.renderBody()}</tbody>
        </table>
        <Pagination
          onChange={(e) => {
            this.setState({ page: Number(e.target.value) });
          }}
          onClick={(e) => {
            this.pageNavigation(e);
          }}
          page1={this.state.pageNo1+1}
          page2={this.state.pageNo2}
        />
      </>
    );
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      this.pageChangeTable();
    }
    if (
      prevState.pageNo1 !== this.state.pageNo1 ||
      prevState.pageNo2 !== this.state.pageNo2
    ) {
      this.handleNavigation();
    }

    if (prevState.filterText !== this.state.filterText) {
      console.log(this.state.sliceItem);
      this.handleSearch();
      if (this.state.filterText === "") {
        this.setState({ sliceItem: this.state.searchItem });
      }
    }
  }

  //search
  handleSearch = () => {
    const filtred = this.state.items.filter((item) => {
      return Object.keys(item).some((key) =>
        item[key]
          .toString()
          .toLowerCase()
          .includes(this.state.filterText.toLowerCase())
      );
    });
    this.setState({ sliceItem: filtred });
  };
  //search Son
  //Sıralama
  sortTableNumber = () => {
    if (this.state.sortString === "asc") {
      this.setState({
        sliceItem: this.state.sortArray.sort((a, b) => b.id - a.id),
      });
    } else {
      this.setState({
        sliceItem: this.state.sortArray.sort((a, b) => a.id - b.id),
      });
    }
  };
  sortTableStringTitle = () => {
    if (this.state.sortString === "asc") {
      this.setState({
        sliceItem: this.state.sortArray.sort((a, b) => {
          a = a.title || "";
          b = b.title || "";
          return a.localeCompare(b);
        }),
      });
    } else {
      this.setState({
        sliceItem: this.state.sortArray.sort((a, b) => {
          a = a.title || "";
          b = b.title || "";
          return b.localeCompare(a);
        }),
      });
    }
  };
  sortTableStringCompleted = () => {
    if (this.state.sortString === "asc") {
      this.setState({
        sliceItem: this.state.sortArray.sort((a, b) => {
          a = a.completed.toString() || "";
          b = b.completed.toString() || "";
          return a.localeCompare(b);
        }),
      });
    } else {
      this.setState({
        sliceItem: this.state.sortArray.sort((a, b) => {
          a = a.completed.toString() || "";
          b = b.completed.toString() || "";
          return b.localeCompare(a);
        }),
      });
    }
  };
  //sıralam Son

  //sayfalama

  pageChangeTable = () => {
    console.log(this.state.page);
    this.setState({
      sliceItem: this.state.items.slice(0, this.state.page),
      pageNo1: 0,
      pageNo2: this.state.page,
    });
  };
  // sayfa navigation

  pageNavigation = (e) => {
    let val = this.state.items.length;
    if (val % this.state.page > 0) {
      val = (val % this.state.page) + val;
    }
    if (e.target.name === "up") {
      if (this.state.pageNo2 + this.state.page > val) {
        this.setState({
          pageNo1: this.state.pageNo1,
          pageNo2: this.state.pageNo2,
        });
        alert("sayfa sonu");
      } else {
        this.setState({
          pageNo1: this.state.pageNo1 + this.state.page,
          pageNo2: this.state.pageNo2 + this.state.page,
        });
      }
    } else {
      if (this.state.pageNo1 - this.state.page <0) {
        this.setState({
          pageNo1: this.state.pageNo1,
          pageNo2: this.state.pageNo2,
        });
        alert("sayfa başı");
      } else {
        this.setState({
          pageNo1: this.state.pageNo1 - this.state.page,
          pageNo2: this.state.pageNo2 - this.state.page,
        });
      }
      
    }
  };
  handleNavigation = () => {
    this.setState({
      sliceItem: this.state.items.slice(this.state.pageNo1, this.state.pageNo2),
    });
  };
  //sayfalama son
  saveChanges = () => {
    // insert
    const { todo, items, sliceItem } = this.state;
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map((x) => x.id)) + 1;
      items.push(todo);
      this.setState({ items, todo: null });
      alert("Ekleme işlemi başarıyla gerçekleşti.");
      return;
    }
    // update
    const index = items.findIndex((item) => item.id == todo.id);
    const index1 = sliceItem.findIndex((item) => item.id == todo.id);
    items[index] = todo;
    sliceItem[index] = todo;
    this.setState({ items, todo: null, sliceItem });
  };

  onAdd = () => {
    this.setState({
      todo: {
        id: -1,
        title: "",
        completed: false,
      },
    });
  };

  onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?");

    if (!status) {
      return;
    }
    const { items, sliceItem } = this.state;
    const index = items.findIndex((item) => item.id == id);
    const index1 = sliceItem.findIndex((item) => item.id == id);
    items.splice(index, 1);
    sliceItem.splice(index1, 1);
    this.setState({ items, sliceItem });
  };

  onEdit = (todo) => {
    this.setState({ todo });
  };

  onTitleChange = (value) => {
    const todo = this.state.todo;
    todo.title = value;
    this.setState({ todo });
  };

  onCompletedChange = (value) => {
    const todo = this.state.todo;
    todo.completed = value;
    this.setState({ todo });
  };

  renderEditForm = () => {
    const { todo } = this.state;
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={(e) => this.onTitleChange(e.target.value)}
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={(e) => this.onCompletedChange(e.target.checked)}
        />
        <Button onClick={this.saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={this.cancel}>
          Vazgeç
        </Button>
      </>
    );
  };

  cancel = () => {
    this.setState({ todo: null });
  };

  render() {
    const { todo, loading } = this.state;
    return (
      <>
        {loading
          ? "Yükleniyor...."
          : todo
          ? this.renderEditForm()
          : this.renderTable()}
      </>
    );
  }
}
