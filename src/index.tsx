// tslint:disable
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from '@material-ui/core';

import { Chance } from 'chance';
import * as React from 'react';
import { render } from 'react-dom';

import { DataGridAutosizer } from './DataGrid';

const numberOfColumns = 20;
const numberOfRecords = 500;
const updateDataSourceIntervalMS = 500;

const getCellValue = (row: any, columnName: string) => `~ ${row[columnName]}`;

const columns: any = Chance().n(() => {
  const column = Chance().string();
  return { name: column, title: column, getCellValue };
}, numberOfColumns);

const dataSource: any = Chance().n(
  () =>
    columns.reduce(
      (record: {}, column: any) => ({
        ...record,
        [column.name]: Chance().string()
      }),
      {
        id: Chance().integer({ min: 1 })
      }
    ),
  numberOfRecords
);

const theme = createMuiTheme();

const nextDataSource = () => {
  const numberOfColumnsToBeModified = Chance().integer({
    min: 1,
    max: columns.length
  });

  const columnsToBeModified = Chance().pickset(
    columns,
    numberOfColumnsToBeModified
  );

  const rowIndexToBeModified = 0;
  /* const rowIndexToBeModified = Chance().integer({
    min: 0,
    max: dataSource.length - 1
  }); */

  const modifiedRow = { ...dataSource[rowIndexToBeModified] };

  columnsToBeModified.forEach(({ name: columnToBeModified }) => {
    modifiedRow[columnToBeModified] = Chance().string();
  });

  const nextDataSource = [...dataSource];

  nextDataSource[rowIndexToBeModified] = modifiedRow;

  return nextDataSource;
};

class DataGridHost extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      dataSource,
    };
  }

  public componentDidMount() {
    setInterval(() => {
      this.setState({
        dataSource: nextDataSource()
      });
    }, updateDataSourceIntervalMS);
  }

  public render() {
    return (
      <div
        style={{
          height: '100vh',
          width: '100vw'
        }}
      >
        <DataGridAutosizer columns={columns} dataSource={this.state.dataSource} />
      </div>
    );
  }
}

const App: React.SFC = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline>
      <DataGridHost />
    </CssBaseline>
  </MuiThemeProvider>
);

render(<App />, document.getElementById('root'));
