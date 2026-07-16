   
      // to open administrator nested-links
      const admin = document.querySelector(".sidebar-section .admin");
      const children = document.querySelector(".sidebar-section ul.children");
      const adminIcon = document.querySelector(".admin-wrpr .icon-wrpr");
      const mobileOpenToggle = document.querySelector(".hamburger-wrpr");
      const mobileCloseToggle = document.querySelector(
        "#sidebar .close-icon",
      );

      mobileOpenToggle.addEventListener("click", () => {
        sidebar.style.width = "250px";
        // sidebar.classList.add("mobile-open");
      });

      mobileCloseToggle.addEventListener("click", () => {
        sidebar.style.width = "0";
      });

      admin.addEventListener("click", () => {
        // adminIcon.style.transform = "rotate(180deg)";
        if (sidebar.classList.contains("closed")) toggleSidebar();
        adminIcon.classList.toggle("open");
        children.classList.toggle("open");
      });

      // sidebar-collapse

      const sidebar = document.querySelector("#sidebar");
      const toggleBtn = document.querySelector(".brand-cell");
      const hideList = document.querySelectorAll("#sidebar .hide");
      const notification = document.querySelectorAll(
        ".notification-badge.on-icon",
      );

      toggleBtn.addEventListener("click", toggleSidebar);

      function toggleSidebar() {
        sidebar.classList.toggle("closed");
        // if(sidebar.classList.contains("closed")){
        //   hideList.forEach((h)=>{
        //     h.style.display = "none";
        //   })
        // }
        // else{
        //   hideList.forEach((h)=>{
        //     h.style.display = "flex";
        //   })
        // }
        hideList.forEach((h) => {
          h.classList.toggle("hidden");
        });

        if (sidebar.classList.contains("closed")) {
          notification.forEach((n) => {
            n.style.opacity = "1";
          });
        } else {
          notification.forEach((n) => {
            n.style.opacity = "0";
          });
        }
      }

      // top-bar date generation

      const today = new Date();

      document.getElementById("topbar-date").textContent =
        today.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

      // clock-date generation

      document.querySelectorAll(".attendance-card .clock-date").forEach((e) => {
        e.textContent = today.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      });

   
