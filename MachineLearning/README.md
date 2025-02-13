# Dự đoán chỉ số chất lượng không khí (AQI)

## Mục đích
Xử lí và trực quan hóa dữ liệu về các chỉ số không khí. Từ đó, dự đoán chỉ số chất lượng không khí AQI.

## Mục tiêu
Chương trình này được thiết kế để thu thập (crawl), làm sạch/ chuẩn hóa (clean) và trực quan hóa (visualization) dữ liệu.

## Yêu cầu về môi trường
Chương trình này được viết bằng Python và sử dụng các thư viện sau:

- bs4
- requests
- pandas
- json
- matplotlib
- numpy
- sklearn
- scipy
- mpl_toolkits
- seaborn

## Hướng dẫn cài đặt
Để cài đặt các thư viện cần thiết, bạn có thể sử dụng pip, một trình quản lý gói Python. Mở terminal và chạy các lệnh sau:

```bash
pip install beautifulsoup4
pip install requests
pip install pandas
pip install json
pip install matplotlib
pip install numpy
pip install scikit-learn
pip install seaborn
```
## Hướng dẫn sử dụng
1) Đảm bảo rằng bạn đã cài đặt Jupyter Notebook và mở file .ipynb trong môi trường đã cài đặt các thư viện cần thiết.
2) Chạy 3 file theo thứ tự sau: 'CrawlData.ipynb' -> 'CleanData.ipynb' -> 'Visualization.ipynb'

## Dữ liệu
Bộ dữ liệu bao gồm các chỉ số AQI và các chỉ số thành phần từ trang web (http://aqi.in)