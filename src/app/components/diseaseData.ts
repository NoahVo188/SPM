export interface DiseaseDetail {
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  riskGroups: string[];
  prevention: string[];
}

export const diseaseDetails: Record<string, DiseaseDetail> = {
  "Ung thư hắc tố (Melanoma)": {
    name: "Ung thư hắc tố (Melanoma)",
    description:
      "Đây là loại ung thư da nguy hiểm nhất vì có khả năng lan nhanh đến các cơ quan khác. Nếu được phát hiện sớm, khả năng điều trị thành công sẽ cao hơn đáng kể.",
    symptoms: [
      "Hình dạng không đối xứng",
      "Viền không đều",
      "Màu sắc không đồng nhất",
      "Đường kính lớn hơn 6mm",
      "Thay đổi theo thời gian",
      "Có thể xuất hiện chảy máu, ngứa hoặc đau",
    ],
    causes: [
      "Tiếp xúc tia UV mạnh",
      "Đột biến tế bào sắc tố",
      "Yếu tố di truyền",
    ],
    riskGroups: [
      "Người có nhiều nốt ruồi trên cơ thể",
      "Người có làn da sáng",
      "Người có tiền sử gia đình mắc ung thư da",
    ],
    prevention: [
      "Theo dõi nốt ruồi thường xuyên",
      "Tránh ánh nắng mạnh và sử dụng kem chống nắng",
      "Khám da định kỳ",
    ],
  },
  "Dày sừng quang hóa (Actinic Keratosis)": {
    name: "Dày sừng quang hóa (Actinic Keratosis)",
    description:
      "Dày sừng quang hóa là một dạng tổn thương da xuất hiện do da bị tổn hại lâu dài bởi tia cực tím (UV) từ ánh nắng mặt trời. Đây được xem là một tình trạng tiền ung thư, nghĩa là nếu không được theo dõi và điều trị kịp thời, một số trường hợp có thể tiến triển thành ung thư da.",
    symptoms: [
      "Xuất hiện các mảng da khô, sần sùi, có cảm giác như giấy nhám khi sờ vào",
      "Màu sắc có thể là đỏ, hồng, nâu hoặc màu da",
      "Có thể bong vảy nhẹ hoặc dày lên theo thời gian",
      "Đôi khi gây ngứa nhẹ, rát hoặc nhạy cảm khi chạm vào",
      "Một số tổn thương khó nhìn thấy nhưng có thể cảm nhận bằng tay",
    ],
    causes: [
      "Tiếp xúc lâu dài với ánh nắng mặt trời mà không có biện pháp bảo vệ",
      "Tích lũy tổn thương da qua nhiều năm",
      "Sử dụng thiết bị tắm nắng nhân tạo",
    ],
    riskGroups: [
      "Người lớn tuổi, đặc biệt trên 40–50 tuổi",
      "Người có làn da sáng, dễ bắt nắng",
      "Người làm việc ngoài trời trong thời gian dài",
      "Người có hệ miễn dịch suy giảm",
    ],
    prevention: [
      "Sử dụng kem chống nắng phổ rộng với SPF từ 30 trở lên mỗi ngày",
      "Đội mũ, mặc áo dài tay khi ra ngoài",
      "Tránh tiếp xúc ánh nắng mạnh trong khoảng 10h đến 16h",
      "Kiểm tra da định kỳ để phát hiện sớm bất thường",
    ],
  },
  "Ung thư biểu mô tế bào đáy (Basal Cell Carcinoma)": {
    name: "Ung thư biểu mô tế bào đáy (Basal Cell Carcinoma)",
    description:
      "Đây là loại ung thư da phổ biến nhất, thường phát triển chậm và hiếm khi di căn. Tuy nhiên, nếu không điều trị, bệnh có thể lan rộng và gây tổn thương nghiêm trọng đến các mô xung quanh. Thường xuất hiện ở vùng da tiếp xúc nhiều với ánh nắng như mặt, mũi, tai và cổ.",
    symptoms: [
      "Xuất hiện nốt nhỏ màu hồng, trắng ngọc trai hoặc trong suốt",
      "Có thể thấy các mạch máu nhỏ trên bề mặt",
      "Vết loét lâu lành, dễ chảy máu hoặc đóng vảy rồi tái phát",
      "Vùng da có thể bị lõm hoặc có viền nổi rõ",
    ],
    causes: [
      "Tiếp xúc với tia UV trong thời gian dài",
      "Tổn thương DNA trong tế bào da",
      "Yếu tố di truyền",
    ],
    riskGroups: [
      "Người lớn tuổi",
      "Người có làn da sáng màu",
      "Người thường xuyên tiếp xúc ánh nắng",
    ],
    prevention: [
      "Hạn chế tiếp xúc trực tiếp với ánh nắng",
      "Sử dụng kem chống nắng và đồ bảo hộ",
      "Kiểm tra da thường xuyên, đặc biệt khi có tiền sử bệnh",
    ],
  },
  "Dày sừng tiết bã (Seborrheic Keratosis)": {
    name: "Dày sừng tiết bã (Seborrheic Keratosis)",
    description:
      "Đây là một dạng tổn thương da lành tính, rất phổ biến và không nguy hiểm. Các tổn thương thường có hình dạng như được dính trên bề mặt da. Mặc dù không phải ung thư, nhưng đôi khi có thể bị nhầm lẫn với các bệnh lý nghiêm trọng hơn.",
    symptoms: [
      "Mảng da màu nâu, đen hoặc vàng",
      "Bề mặt sần sùi, dày, giống sáp hoặc mụn cóc",
      "Có thể tăng kích thước và số lượng theo thời gian",
      "Thường không đau, đôi khi gây ngứa nhẹ",
    ],
    causes: [
      "Quá trình lão hóa da",
      "Yếu tố di truyền",
      "Không liên quan trực tiếp đến ánh nắng",
    ],
    riskGroups: ["Người trung niên và cao tuổi", "Người có tiền sử gia đình"],
    prevention: [
      "Không có biện pháp phòng ngừa cụ thể",
      "Theo dõi sự thay đổi bất thường về hình dạng hoặc màu sắc",
    ],
  },
  "U xơ da (Dermatofibroma)": {
    name: "U xơ da (Dermatofibroma)",
    description:
      "U xơ da là một khối u lành tính nhỏ trên da, không gây nguy hiểm. Thường hình thành như phản ứng của da sau các tổn thương nhẹ như côn trùng cắn hoặc trầy xước.",
    symptoms: [
      "Nốt nhỏ, cứng, hình tròn",
      "Màu nâu, đỏ hoặc tím",
      "Khi ấn vào có thể lõm xuống",
      "Không đau, đôi khi gây ngứa",
    ],
    causes: [
      "Phản ứng sau chấn thương nhẹ trên da",
      "Côn trùng cắn",
      "Viêm da nhẹ",
    ],
    riskGroups: ["Người trưởng thành", "Nữ giới gặp nhiều hơn nam"],
    prevention: ["Tránh làm tổn thương da", "Giữ vệ sinh da sạch sẽ"],
  },
  "Nốt ruồi hắc tố (Melanocytic Nevus)": {
    name: "Nốt ruồi hắc tố (Melanocytic Nevus)",
    description:
      "Nốt ruồi lành tính là sự phát triển bình thường của các tế bào sắc tố trên da. Đây là hiện tượng rất phổ biến và thường không gây nguy hiểm.",
    symptoms: [
      "Nốt tròn hoặc hình oval",
      "Màu nâu hoặc đen",
      "Kích thước ổn định theo thời gian",
      "Có thể phẳng hoặc hơi nhô lên",
    ],
    causes: [
      "Tăng sinh tế bào sắc tố",
      "Yếu tố di truyền",
      "Ảnh hưởng của ánh nắng",
    ],
    riskGroups: [
      "Hầu hết mọi người đều có",
      "Thường xuất hiện từ nhỏ hoặc tuổi thiếu niên",
    ],
    prevention: [
      "Theo dõi nếu có thay đổi bất thường",
      "Hạn chế tiếp xúc ánh nắng mạnh",
    ],
  },
  "Tổn thương mạch máu (Vascular Lesions)": {
    name: "Tổn thương mạch máu (Vascular Lesions)",
    description:
      "Đây là nhóm các bất thường liên quan đến mạch máu dưới da, bao gồm u máu và các dị dạng mạch máu. Phần lớn là lành tính nhưng có thể ảnh hưởng đến thẩm mỹ hoặc phát triển lớn theo thời gian.",
    symptoms: [
      "Vùng da có màu đỏ, tím hoặc xanh",
      "Có thể phẳng hoặc nổi lên",
      "Một số trường hợp thay đổi kích thước theo thời gian",
    ],
    causes: [
      "Dị dạng mạch máu bẩm sinh",
      "Tăng sinh mạch máu bất thường",
      "Ảnh hưởng của tuổi tác",
    ],
    riskGroups: ["Trẻ sơ sinh (đối với u máu)", "Người lớn tuổi"],
    prevention: [
      "Không có biện pháp phòng ngừa hoàn toàn",
      "Theo dõi sự phát triển của tổn thương",
      "Đi khám khi có dấu hiệu lớn nhanh, đau hoặc thay đổi bất thường",
    ],
  },
};
// Mapping từ tên AI trả về → key trong diseaseDetails
export const aiToDiseaseName: Record<string, string> = {
  "Bệnh dày sừng quang hóa (akiec)": "Dày sừng quang hóa (Actinic Keratosis)",
  "Ung thư biểu mô tế bào đáy (bcc)":
    "Ung thư biểu mô tế bào đáy (Basal Cell Carcinoma)",
  "Dày sừng tiết bã (bkl)": "Dày sừng tiết bã (Seborrheic Keratosis)",
  "U xơ da (df)": "U xơ da (Dermatofibroma)",
  "Ung thư hắc tố (mel)": "Ung thư hắc tố (Melanoma)",
  "Nốt ruồi hắc tố (nv)": "Nốt ruồi hắc tố (Melanocytic Nevus)",
  "Tổn thương mạch máu (vasc)": "Tổn thương mạch máu (Vascular Lesions)",
};
