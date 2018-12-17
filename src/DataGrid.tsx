// tslint:disable
import {
  IntegratedSorting,
  Sorting,
  SortingState
} from '@devexpress/dx-react-grid';

import {
  DragDropProvider,
  Grid,
  TableColumnReordering,
  TableHeaderRow,
  VirtualTable,
  Table as MuiTable
} from '@devexpress/dx-react-grid-material-ui';

import * as React from 'react';
import { AutoSizer, Size } from 'react-virtualized';

export interface IDataGridProps {
  columns: any;
  dataSource: any;
  width: number;
  height: number;
}

export interface IDataGridState {
  columnsOrder: string[];
  sorting: Sorting[];
}

class PureTableRow extends React.Component<MuiTable.DataRowProps> {
  public shouldComponentUpdate(nextProps: MuiTable.DataRowProps) {
    // return this.props.row !== nextProps.row;
    return true;
  }

  public render() {
    return <MuiTable.Row {...this.props} />;
  }
}

const pureTableRow = (props) => <PureTableRow {...props} />;

class PureTableCell extends React.Component<MuiTable.DataCellProps> {
  public shouldComponentUpdate(nextProps: MuiTable.DataCellProps) {
    // return this.props.value !== nextProps.value;
    return true;
  }

  public render() {
    return <MuiTable.Cell {...this.props} />;
  }
}

const pureTableCell = (props) => <PureTableCell {...props} />;

export const DataGridAutosizer = (props) => (
  <AutoSizer
      children={({ width, height }: Size) => (
        <DataGrid {...props} width={width} height={height} />
      )}
    />
);

export class DataGrid extends React.Component<IDataGridProps, IDataGridState> {
  constructor(props: IDataGridProps) {
    super(props);

    this.state = {
      columnsOrder: props.columns.map(({ name }: { name: string }) => name),
      sorting: [],
    };
  }

  public render() {
    const { columns, dataSource, width, height } = this.props;

    return (
      <div style={{ width, height }}>
        <Grid rows={dataSource} columns={columns} getRowId={({ id }) => id}>
          <SortingState
            sorting={this.state.sorting}
            onSortingChange={this.changeSorting}
          />
          <IntegratedSorting />
          <DragDropProvider />
          <VirtualTable
            height={height}
            rowComponent={pureTableRow}
            cellComponent={pureTableCell}
          />
          <TableHeaderRow showSortingControls />
          <TableColumnReordering
            order={this.state.columnsOrder}
            onOrderChange={this.changeColumnOrder}
          />
        </Grid>
      </div>
    );
  }

  private changeColumnOrder = (columnsOrder: string[]) => {
    this.setState({
      columnsOrder
    });
  };

  private changeSorting = (sorting: Sorting[]) => {
    this.setState({
      sorting
    });
  };
}
