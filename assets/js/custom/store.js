document.addEventListener('alpine:init', () => {
    Alpine.store('pendingTally', {

        url: "https://script.google.com/macros/s/AKfycbwHLul95aulaj0YUsvE-BEfDqOg6lYgbM-r1RbrUvUrwzFgw9MjvO_st4o7Ex0gb1fV/exec",
        pending: [],
        inventory: [],
        recentPosts: [],

        init() {
            this.getInventory();
            this.getRecentPosts();
        },

        async getInventory () {
            try {
              this.inventory = await (await fetch(this.url + '?sheet=inventory')).json();
            } catch (error) {
              alert('Error connecting. Please check your connection then refresh page.')
            }
          },

          async getRecentPosts() {
            this.recentPosts =  await (await fetch(this.url + '?recent=true')).json();
          },

        postPending(workloadData) {
            this.recentPosts[0] = {
                Date: new Date(),
                NumberOfDocuments: workloadData.NumberOfDocuments,
                ItemsOrdered: workloadData.ItemsOrdered,
                NumberOutOfStock: workloadData.NumberOutOfStock
            }
            this.postRecursive()
        },
        
        postRecursive() {
            setTimeout(() => {                
                if (this.pending.length && this.pending.length > 0) {
                    const data = this.pending.shift();
                    try {
                        fetch(this.url, {
                            method: "POST",
                            body: JSON.stringify(data),
                          })
                            .then(res => res.text())
                            .then(data => this.getRecentPosts())
                            .catch(err =>this.postRecursive())
                        
                    } catch (error) {
                        this.postRecursive()
                    }
                }
            }, 2000);
        }


    })
})