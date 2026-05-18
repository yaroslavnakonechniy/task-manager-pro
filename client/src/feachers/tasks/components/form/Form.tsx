import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button, Form, Input, Divider, Typography, message, Select, Spin, Alert } from 'antd';
import type { Workflow } from '../../../../types/workflow.type';
import type { CreateTaskProps, FormValues} from '../../../../types/formTask.type';
import { useCreateTaskMutation, useUpdateTaskMutation } from '../../api/tasks.api';
import { useGetBoardsQuery } from '../../../boards/api/boards.api';

const { Title } = Typography

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

export const WORKFLOWS: Workflow[] = [
  { code: "todo", label: "To Do" },
  { code: "progress", label: "In Progress" },
  { code: "done", label: "Done" },
];

export const FormTask = ({ task, mode }: CreateTaskProps) => {
    const [form] = Form.useForm();
    const variant = Form.useWatch('variant', form);
    const navigate = useNavigate();
    const { boardId } = useParams();
    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();

    const { data, isLoading, error } = useGetBoardsQuery();

    useEffect(() => {
        if (mode === "edit" && task) {
            form.setFieldsValue({
                TaskTitle: task.title,
                TaskDescription: task.description,
                TaskWorkflow: (task.workflow as any).code,
                TaskBoardId: task.boardId
            });
        } else if (mode === "create" && boardId) {
            const cleanBoardId = (boardId === "undefined" || !boardId) ? undefined : boardId;

            form.setFieldsValue({
                TaskBoardId: cleanBoardId
            });
        }

    }, [task, mode, form, boardId]);

    if (isLoading) {
        return <Spin size="large" style={{ marginTop: 100 }} />;
    }

    if (error) {
        return <Alert type="error" title="Failed to load boards" />;
    }

    const onFinish = async (values: FormValues) => {
        try {
            if (mode === "create") {
                await createTask({
                    title: values.TaskTitle,
                    description: values.TaskDescription,
                    workflow: values.TaskWorkflow,
                    boardId: values.TaskBoardId,
                }).unwrap();

                message.success("Task created successfully");
                navigate(-1);
            }

            if (mode === "edit" && task) {
                await updateTask({
                    id: task.id,
                    title: values.TaskTitle,
                    description: values.TaskDescription,
                    boardId: values.TaskBoardId,
                }).unwrap();

                message.success("Task updated successfully");
                navigate(1);
            }
            
        } catch (error) {
            message.error("Operation failed");
        }
    };

    return(
        <>
            <Divider/>
                <Title level={2}>{mode === "edit" ? "Edit task" : "Create task"}</Title>
                <Form
                    {...formItemLayout}
                    form={form}
                    onFinish={onFinish}
                    variant={variant || 'filled'}
                    style={{ maxWidth: 600, margin: "0 auto" }}
                    initialValues={{ 
                        variant: 'filled',
                        TaskBoardId: boardId
                    }}
                    >

                    <Form.Item 
                        label="TaskTitle" 
                        name="TaskTitle" 
                        rules={[
                            { required: true, message: 'Please input!' },
                            { min: 3, message: "Name must be at least 3 characters" },
                            { max: 50, message: "Name must be less than 50 characters" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item 
                        label="TaskDescription" 
                        name="TaskDescription" 
                        rules={[
                            { required: true, message: 'Please input!' },
                            { min: 3, message: "Name must be at least 3 characters" },
                            { max: 1000, message: "Name must be less than 1000 characters" }
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    {
                        mode === 'create' ? (
                            <>
                                <Form.Item
                                    label="Board"
                                    name="TaskBoardId"
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="Select a board"
                                        allowClear
                                        options={data?.map(board => ({
                                            value: board.id,
                                            label: board.name
                                        }))}
                                    />
                                </Form.Item>

                                <Form.Item 
                                    label="TaskWorkflow" 
                                    name="TaskWorkflow" 
                                    rules={[
                                        { required: true, message: 'Please input!' }
                                    ]}
                                >
                                    <Select
                                        options={WORKFLOWS.map(w => ({
                                            value: w.code,
                                            label: w.label
                                        }))}
                                    />
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Form.Item name="TaskBoardId" hidden><Input /></Form.Item>
                            </>
                        )
                    }
                    
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" size="large">
                            {mode === "edit" ? "Save" : "Create Task"}
                        </Button>
                    </Form.Item>
                </Form>
            <Divider/>
        </>
    )
}
