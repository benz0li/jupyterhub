import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom-v5-compat";
import PaginationFooter from "../PaginationFooter/PaginationFooter";

const Groups = (props) => {
  var groups_data = useSelector((state) => state.groups_data),
    groups_page = useSelector((state) => state.groups_page),
    dispatch = useDispatch();

  const { setOffset, offset, setLimit, handleLimit, limit, setPagination } =
    usePaginationParams();

  var total = groups_page ? groups_page.total : undefined;

  var { updateGroups, history } = props;

  const dispatchPageUpdate = (data, page) => {
    setPagination(page);
    dispatch({
      type: "GROUPS_PAGE",
      value: {
        data: data,
        page: page,
      },
    });
  };

  useEffect(() => {
    updateGroups(offset, limit).then((data) =>
      dispatchPageUpdate(data.items, data._pagination),
    );
  }, [offset, limit]);

  if (!groups_data || !groups_page) {
    return <div data-testid="no-show"></div>;
  }

  return (
    <div className="container" data-testid="container">
      <div className="row">
        <div className="col-md-12 col-lg-10 col-lg-offset-1">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4>Groups</h4>
            </div>
            <div className="panel-body">
              <ul className="list-group">
                {groups_data.length > 0 ? (
                  groups_data.map((e, i) => (
                    <li className="list-group-item" key={"group-item" + i}>
                      <span className="badge badge-pill badge-success">
                        {e.users.length + " users"}
                      </span>
                      <Link
                        to={{
                          pathname: "/group-edit",
                          state: {
                            group_data: e,
                          },
                        }}
                      >
                        {e.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <div>
                    <h4>no groups created...</h4>
                  </div>
                )}
              </ul>
              <PaginationFooter
                offset={offset}
                limit={limit}
                visible={groups_data.length}
                total={total}
                next={() => setOffset(offset + limit)}
                prev={() => setOffset(offset - limit)}
                handleLimit={handleLimit}
              />
            </div>
            <div className="panel-footer">
              <button className="btn btn-light adjacent-span-spacing">
                <Link to="/">Back</Link>
              </button>
              <button
                className="btn btn-primary adjacent-span-spacing"
                onClick={() => {
                  history.push("/create-group");
                }}
              >
                New Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Groups.propTypes = {
  updateUsers: PropTypes.func,
  updateGroups: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};

export default Groups;
