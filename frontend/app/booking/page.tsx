.container{ 
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cont-book{
  width: 90vw;
  height: 90vh;
  
}
.titleb{
  color: #16a34a;
  position: center;
}
.booking-list{
  width: 90vw;
  padding: 10px;
  gap: 10px;
   display: flex;
  
  flex-direction: column;
}
.booking-card{
  width: 85vw;
  background-color: #c2ffd3;
  padding: 20px;
}






.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-danger {
  color: #dc2626;
  background-color: #fff;
  
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  width: 15vw;
}

.btn-danger:hover {
 background: #dc2626;
  color: white;
  font-weight: 700;
}

.btn-success {
  background-color: #fff;
  color: #16a34a;
 
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  width: 15vw;
}

.btn-success:hover {
  background: #16a34a;
  color: white;
  font-weight: 700;
}



.badge {
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 8px;
  font-weight: 400;
}

/* الانتظار */
.badge.pending {
  background-color: rgb(255, 255, 111);
  color: black;
  font-weight: 400;
}

/* مقبول */
.badge.accepted {
  background-color: rgb(78, 202, 78);
  color: white;
  font-weight: 400;
}

/* مرفوض */
.badge.rejected {
  background-color: rgb(224, 64, 64);
  color: white;
  font-weight: 400;
}


.booking-card img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

