document.addEventListener('alpine:init', () => {
    Alpine.store('pendingTally', {
        url: "https://script.google.com/macros/s/AKfycbwHLul95aulaj0YUsvE-BEfDqOg6lYgbM-r1RbrUvUrwzFgw9MjvO_st4o7Ex0gb1fV/exec",
        pending: [],
        init() {
            setTimeout(() => {
                this.postPending();
            }, 2000);

        },
        postPending() {
            const data = this.pending.shift();
            if (this.pending.length && this.pending.length > 0) {
                const data = this.pending.shift();
                console.log(data)
                try {
                    fetch(this.url, {
                        method: "POST",
                        body: JSON.stringify(this.pending.shift()),
                      })
                        .then(res => res.text())
                        .then(data => this.postPending())
                        .catch(err =>this.postPending())
                    
                } catch (error) {
                    this.postPending()
                }
            }
        }
    })
})