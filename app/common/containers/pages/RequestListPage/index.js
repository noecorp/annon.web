import React from 'react';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import withStyles from 'nebo15-isomorphic-style-loader/lib/withStyles';

import RequestDetails from 'containers/blocks/RequestDetails';

import { H1 } from 'components/Title';
import FoldingTable from 'components/FoldingTable';
import StatusCode from 'components/StatusCode';
import Button from 'components/Button';
import { format } from 'helpers/date';
// import Pagination from 'components/Pagination';

import { getRequests } from 'reducers';

import { fetchRequests } from './redux';
import styles from './styles.scss';

@withStyles(styles)
@provideHooks({
  fetch: ({ dispatch }) => dispatch(fetchRequests()),
})
@connect(state => ({
  ...state.pages.RequestListPage,
  requests: getRequests(state, state.pages.RequestListPage.requests),
}))
export default class RequestListPage extends React.Component {
  render() {
    const { requests = [] } = this.props;
    return (
      <div id="request-list-page">
        <H1>Requests</H1>
        <p>Select Request to see details.</p>
        <div className={styles.table}>
          <FoldingTable
            columns={[
              { key: 'status_code', title: 'Status' },
              { key: 'method', title: 'Method' },
              { key: 'path', title: 'Path' },
              { key: 'client_ip', title: 'Client IP' },
              { key: 'date', title: 'Date' },
              { key: 'api', title: 'Api' },
            ]}
            data={requests.map(i => ({
              ...i,
              status_code: <StatusCode code={i.status_code} />,
              method: i.request.method,
              path: i.request && i.request.uri,
              client_ip: i.ip_address,
              date: <span className="nowrap">{format(i.inserted_at, 'DD.MM.YYYY HH:mm:ss')}</span>,
              api: i.api ? <Button theme="link" to={`/apis/${i.api.id}`}>Edit API</Button> : '–',
            }))}
            component={RequestDetails}
          />
          {
            // <div className={styles.pagination}>
            //   <Pagination
            //     count={20}
            //     current={5}
            //     formatter={v => `/apis?page=${v}`}
            //   />
            // </div>
          }
        </div>
      </div>
    );
  }
}
