import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Stock API Test',
      home: StockTestPage(),
    );
  }
}

class StockTestPage extends StatelessWidget {
  const StockTestPage({super.key});

  // Function that fetches stock data from the API and prints the result to the console.
  void fetchStockData() async {
    // Replace with your actual API URL
    final response = await http.get(Uri.parse('https://stock-api-2rul.onrender.com/stock?symbol=GME'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print('API Response: $data');
    } else {
      print('Failed to load stock data. Status code: ${response.statusCode}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stock API Test'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: fetchStockData, // When pressed, the API is called.
          child: const Text('Fetch Stock Data'),
        ),
      ),
    );
  }
}
