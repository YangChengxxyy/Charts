import { Sankey } from '@ant-design/charts';
import React, { useImperativeHandle, useRef } from 'react';

export interface IProps {
  data: { source: string; target: string; value: number }[];
  nodeSort?: (a: Record<string, any>, b: Record<string, any>) => number;
}

const MySankey = React.forwardRef<any, IProps>((props, ref) => {
  const { data, nodeSort } = props || {};
  const innerRef = useRef<any>(null);

  useImperativeHandle(
    ref,
    () => {
      console.log(innerRef.current.getChart());

      return { ...innerRef.current };
    },
    [],
  );

  return (
    <Sankey
      ref={innerRef}
      data={data}
      sourceField="source"
      targetField="target"
      weightField="value"
      nodeSort={nodeSort}
    />
  );
});

export default MySankey;
