import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Panel,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { BookOpen, ListTodo, FileText, Save } from "lucide-react";
import nodeTypes from '../components/nodeTypes';
import type { NoteType } from '../components/TextNode';
import { toast } from "sonner";

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'textNode',
    data: { 
      label: 'My First Chapter',
      type: 'chapter' as NoteType,
    },
    position: { x: 250, y: 100 },
  },
];

const initialEdges: Edge[] = [];

const defaultEdgeOptions = {
  animated: true,
  style: {
    strokeWidth: 2,
    stroke: 'hsl(var(--primary))',
  },
};

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNewNode = useCallback((type: NoteType) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'textNode',
      data: { 
        label: `New ${type.replace('-', ' ')}`,
        type 
      },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`Added new ${type.replace('-', ' ')}`);
  }, [nodes.length, setNodes]);

  const saveFlow = useCallback(() => {
    const flow = { nodes, edges };
    localStorage.setItem('flow', JSON.stringify(flow));
    toast.success('Flow saved successfully!');
  }, [nodes, edges]);

  return (
    <div className="w-screen h-screen bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-muted/10"
      >
        <Panel position="top-left" className="flex flex-col gap-2 bg-background/60 p-2 rounded-lg backdrop-blur-sm border shadow-sm">
          <Button onClick={() => addNewNode('chapter')} variant="secondary" className="gap-2 justify-start">
            <BookOpen className="h-4 w-4" />
            Add Chapter
          </Button>
          <Button onClick={() => addNewNode('main-topic')} variant="secondary" className="gap-2 justify-start">
            <ListTodo className="h-4 w-4" />
            Add Main Topic
          </Button>
          <Button onClick={() => addNewNode('sub-topic')} variant="secondary" className="gap-2 justify-start">
            <FileText className="h-4 w-4" />
            Add Sub Topic
          </Button>
          <Button onClick={saveFlow} variant="outline" className="gap-2 justify-start">
            <Save className="h-4 w-4" />
            Save Flow
          </Button>
        </Panel>
        <Controls className="bg-background/60 border shadow-sm" />
        <MiniMap className="bg-background/60 border shadow-sm" />
        <Background color="#ccc" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Index;