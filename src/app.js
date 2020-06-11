App = {
    contracts:{},
    loadning:false,
    load: async()=>{
        // Load the loadweb3 metamask extension
        await App.connect();
        await App.loadAccount();
        await App.loadContract();
        await App.lanchApp();

    },
    
    connect: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount:async() => {
        App.account = web3.eth.accounts[0];
        console.log(App.account);
    },

    loadContract: async() => {
        const todoList = await $.getJSON('TodoList.json');
        App.contracts.Todolist = TruffleContract(todoList);
        App.contracts.Todolist.setProvider(App.web3Provider);
        
        // interacting with the block chain
        App.todoList = await App.contracts.Todolist.deployed();

        console.log(App.todoList);
    },

    loadTasks: async()=>{
        const taskCount = await App.todoList.taskCount();
        const taskTemplate = $('.taskContainer');
        
        // loop througth each task item
        for (let i = 1; i <= taskCount; i++) {
            console.log("tasks counter "+taskCount);
            // getting each task
            const task = await App.todoList.tasks(i);
            const taskId = task[0].toNumber();
            const taskContent = task[1];
            const taskCompleted = task[2];

            // create template for this task
            const newTemplate = taskTemplate.clone();
            newTemplate.find('.content').html(taskContent);
            newTemplate.find('input')
                            .prop('name',taskId)
                            .prop('checked',taskCompleted)
                            .on('click',App.toggleCompleted);

            // add the list to the dom
            if(taskCompleted){
                $('#completedTaskList').append(newTemplate)
            }else{
                $('#taskList').append(newTemplate);
            }
            
            // show the added task
            newTemplate.show();
        }
    },

    toggleCompleted: ()=>{

    },

    setLoading: (state) =>{
      App.loadning = state;
      const loader = $('#loader');
      const content = $('#content');

      if(state){
          loader.show();
          content.hide();
      }else{
          loader.hide();
          content.show();
      }
    },

    lanchApp:async() => {
        // prevent hiting this funcion so many times
        if(App.loadning){
            return;
        }

        App.setLoading(true);

        $('#account').html(App.account);

        // laod all the tasks
        await App.loadTasks();

        App.setLoading(false);
    }

};

$(()=>{
   $(window).load(()=>{
       App.load();
   })       
});

