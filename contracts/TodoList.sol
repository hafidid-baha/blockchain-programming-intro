pragma solidity >=0.4.21 <0.7.0;

contract TodoList{
    // taskcount to track the number of tasks inside our  blockchain
    uint public taskCount = 0;

    // create task type
    struct Task{
        uint id;
        string content;
        bool completed;
    }

    // create a mapping to store the tasks objects inside
    mapping(uint => Task) public tasks;

    // create a function to create a single task
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount,_content,false);
    }

    // create the constractor to create the default task to the default list
    // and push it to the tasks mapping
    constructor() public {
        createTask("this is my default task");
    }
}