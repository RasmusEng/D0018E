# PRODUCTS
### GET
GET products/listed  
GET products/unlisted (Admin)    
GET products/product:id (Should also include reviews)  

### POST
POST products/create (Admin)

### PATCH
PATCH products/change_product:id (Admin)  
PATCH products/change_stock:id  

### DEL
DEL products/product:id (AUTH)

# REVIEW
### GET
GET review/product:id   

POST review/create  

### PATCH
PATCH review/edit:id (AUTH)  

### DEL
DEL review/remove:id (AUTH admin and user)  

# USERS
### GET
GET users/ (admin)  
GET users/:id (admin)  

### POST
POST users/create 

### PATCH
PATCH users/edit:id (AUTH)  

### DEL
DEL users/:id (AUTH admin and user)  

# ORDERS
GET orders/ (ADMIN)  
GET orders/:id (AUTH)  

### POST
POST orders/create 

### PATCH
PATCH orders/:id (AUTH)  

### DEL
DEL orders/:id (AUTH)  

# ORDER_ITEMS
### GET
GET order_items/:order_id (AUTH)  
GET order_items/:produc_id (ADMIN)  

### POST
POST order_items/:order_id (AUTH)  

### PATCH
PATCH order_items/:order_id (AUTH)  

### DEL
DEL order_items/:order_id (AUTH)  

# AUTH (LOGIN)  
