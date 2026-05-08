export interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
}

// Popular banks in Vietnam compatible with VietQR
export const POPULAR_BANKS: Bank[] = [
  { id: 17, name: "Ngân hàng TMCP Ngoại Thương Việt Nam", code: "VCB", bin: "970436", shortName: "Vietcombank", logo: "https://api.vietqr.io/img/VCB.png" },
  { id: 4, name: "Ngân hàng TMCP Công thương Việt Nam", code: "ICB", bin: "970415", shortName: "VietinBank", logo: "https://api.vietqr.io/img/ICB.png" },
  { id: 3, name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", code: "BIDV", bin: "970418", shortName: "BIDV", logo: "https://api.vietqr.io/img/BIDV.png" },
  { id: 2, name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam", code: "VBA", bin: "970405", shortName: "Agribank", logo: "https://api.vietqr.io/img/VBA.png" },
  { id: 26, name: "Ngân hàng TMCP Quân đội", code: "MB", bin: "970422", shortName: "MBBank", logo: "https://api.vietqr.io/img/MB.png" },
  { id: 14, name: "Ngân hàng TMCP Kỹ thương Việt Nam", code: "TCB", bin: "970407", shortName: "Techcombank", logo: "https://api.vietqr.io/img/TCB.png" },
  { id: 25, name: "Ngân hàng TMCP Á Châu", code: "ACB", bin: "970416", shortName: "ACB", logo: "https://api.vietqr.io/img/ACB.png" },
  { id: 40, name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", code: "VPB", bin: "970432", shortName: "VPBank", logo: "https://api.vietqr.io/img/VPB.png" },
  { id: 34, name: "Ngân hàng TMCP Tiên Phong", code: "TPB", bin: "970423", shortName: "TPBank", logo: "https://api.vietqr.io/img/TPB.png" },
  { id: 21, name: "Ngân hàng TMCP Sài Gòn Thương Tín", code: "STB", bin: "970403", shortName: "Sacombank", logo: "https://api.vietqr.io/img/STB.png" },
  { id: 13, name: "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh", code: "HDB", bin: "970437", shortName: "HDBank", logo: "https://api.vietqr.io/img/HDB.png" },
  { id: 39, name: "Ngân hàng TMCP Quốc tế Việt Nam", code: "VIB", bin: "970441", shortName: "VIB", logo: "https://api.vietqr.io/img/VIB.png" },
  { id: 15, name: "Ngân hàng TMCP Sài Gòn - Hà Nội", code: "SHB", bin: "970443", shortName: "SHB", logo: "https://api.vietqr.io/img/SHB.png" },
  { id: 16, name: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam", code: "EIB", bin: "970431", shortName: "Eximbank", logo: "https://api.vietqr.io/img/EIB.png" },
  { id: 11, name: "Ngân hàng TMCP Phương Đông", code: "OCB", bin: "970448", shortName: "OCB", logo: "https://api.vietqr.io/img/OCB.png" },
];
