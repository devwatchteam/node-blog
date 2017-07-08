const paginate = (list) => {
  const ppp = 5;
  const pages = Math.ceil(list.length / ppp);
  const paginatedList = [];
  let start = 0;
  let end = ppp;

  for (let i = 0; i < pages; i++) {
    paginatedList[i] = {
      pages,
      page: i,
      list: list.slice(start, end)
    }

    //kick up the start and stop for the slice
    start = end;
    end += ppp;
  }

  return paginatedList;
}

module.exports = paginate;
